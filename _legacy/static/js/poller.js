/**
 * poller.js
 * Orchestrates loops and API calls.
 * Decoupled from UI. Talks ONLY to API and State.
 */

const Poller = {
    // --- Generic Start Logic ---
    async start(module, payload) {
        // Optimistic update
        const target = payload.target_folder;
        State.setStarted(module, target);

        try {
            const res = await API.runScript(module, payload);
            if (res.status === 'started' || res.status === 'running') {
                State.setStarted(module); // Confirm
                this.pollStatus(module);
                this.pollOutput(module);
            } else {
                State.setError(module);
                State.emitLog(module, "Failed to start script: Invalid Server Response");
            }
        } catch (e) {
            State.setError(module);
            State.emitLog(module, "Error starting script: " + e.message);
        }
    },

    async cancel(module) {
        if (!State.get(module).isRunning) return;

        try {
            await API.cancelScript(module);
            State.emitLog(module, "\nRequesting cancellation...\n");
        } catch (e) {
            State.emitLog(module, "Error sending cancel request.");
        }
    },

    // --- Generic Poll Loop ---
    pollStatus: async function (module) {
        if (!State.get(module).isRunning) return;

        try {
            const data = await API.checkStatus(module);

            // STATE TRANSITION: Stopped
            if (!data.running) {
                State.setStopped(module, STATUS.FINISHED);
                await this.pollOutput(module, true); // Final flush
                return;
            }

            // Still Running
            State.setRunning(module);
            setTimeout(() => this.pollStatus(module), 2000);

        } catch (e) {
            console.error("Poll Error:", e);
            State.setError(module, true); // Network error

            const count = State.get(module).errorCount;
            const delay = Math.min(1000 * (2 ** count), 10000);
            setTimeout(() => this.pollStatus(module), delay);
        }
    },

    pollOutput: async function (module, forceOnce = false) {
        if (!State.get(module).isRunning && !forceOnce) return;

        try {
            const data = await API.getOutput(module);

            // Broadcast logs
            if (data.output && data.output.length > 0) {
                data.output.forEach(line => State.emitLog(module, line));
            }

            // Update Progress (if applicable)
            if (data.files_checked !== undefined) {
                State.setProgress(module, data.files_checked, data.total_files);
            }

            if (!forceOnce && State.get(module).isRunning) {
                setTimeout(() => this.pollOutput(module), 500);
            }
        } catch (e) {
            if (!forceOnce && State.get(module).isRunning) {
                setTimeout(() => this.pollOutput(module), 5000);
            }
        }
    },

    // --- Initial Check ---
    async init() {
        const check = async (module) => {
            try {
                const s = await API.checkStatus(module);
                if (s.running) {
                    State.setStarted(module);
                    this.pollStatus(module);
                    this.pollOutput(module);
                }
            } catch (e) {
                console.error(`Init Error (${module}):`, e);
            }
        };

        await Promise.all([
            check(MODULE.WEEDING),
            check(MODULE.SEGMENTATION)
        ]);
    }
};
