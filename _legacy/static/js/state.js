/**
 * state.js
 * Single Source of Truth for Application State.
 * Taskmaster for the frontend.
 */

const State = {
    // State Store using Modules
    store: {
        [MODULE.WEEDING]: {
            isRunning: false,
            status: STATUS.NOT_STARTED,
            targetFolder: '',
            filesChecked: 0,
            totalFiles: 0,
            errorCount: 0
        },
        [MODULE.SEGMENTATION]: {
            isRunning: false,
            status: STATUS.NOT_STARTED,
            targetFolder: '',
            errorCount: 0
        }
    },

    // Listeners
    listeners: [],

    subscribe(callback) {
        this.listeners.push(callback);
    },

    notify() {
        this.listeners.forEach(cb => cb(this));
    },

    // --- Generic State Transitions ---

    get(module) {
        return this.store[module];
    },

    setStarted(module, targetFolder) {
        const s = this.store[module];
        s.isRunning = true;
        s.status = STATUS.RUNNING;
        if (targetFolder) s.targetFolder = targetFolder;
        s.errorCount = 0;
        this.notify();
    },

    setRunning(module) {
        const s = this.store[module];
        if (!s.isRunning) {
            s.isRunning = true;
            s.status = STATUS.RUNNING;
            this.notify();
        }
    },

    setStopped(module, finalStatus = STATUS.FINISHED) {
        const s = this.store[module];
        s.isRunning = false;
        s.status = finalStatus;
        this.notify();
    },

    setProgress(module, checked, total) {
        const s = this.store[module];
        if (checked !== undefined) s.filesChecked = checked;
        if (total !== undefined) s.totalFiles = total;
        this.notify();
    },

    setError(module, isNetworkError = false) {
        const s = this.store[module];
        if (isNetworkError) {
            s.errorCount++;
        } else {
            s.isRunning = false;
            s.status = STATUS.ERROR;
            this.notify();
        }
    },

    // --- Log Streaming ---
    emitLog(module, text) {
        this.listeners.forEach(cb => cb(this, { type: 'log', module: module, message: text }));
    }
};
