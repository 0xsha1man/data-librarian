/**
 * ui.js
 * Handles DOM updates and Event Listeners.
 * Subscribes to State changes. Generic and Reactive.
 */

const UI = {
    // Current Active Module (for deciding what to show in shared Status bar)
    activeModule: MODULE.WEEDING,

    elements: {
        tabs: {
            [MODULE.WEEDING]: document.getElementById('tab-cleaner'),
            [MODULE.SEGMENTATION]: document.getElementById('tab-pdf')
        },
        sections: {
            [MODULE.WEEDING]: document.getElementById('duplicate-cleaner'),
            [MODULE.SEGMENTATION]: document.getElementById('pdf-splitter')
        },
        // Weeding Elements
        runButton: document.getElementById('runButton'),
        cancelButton: document.getElementById('cancelButton'),
        weedingTarget: document.getElementById('duplicate-target-folder'),
        progressContainer: document.getElementById('progress-container'),
        filesChecked: document.getElementById('files-checked'),
        totalFiles: document.getElementById('total-files'),

        // Segmentation Elements
        runPdfButton: document.getElementById('runPdfButton'),
        pdfTarget: document.getElementById('pdf-target-folder'),
        pdfMaxSize: document.getElementById('pdf-max-size'),
        pdfPageCount: document.getElementById('pdf-page-count'),

        // Shared
        statusLabel: document.getElementById('status-label'),
        statusText: document.getElementById('status-text'),
        output: document.getElementById('output'),
        timestamp: document.getElementById('timestamp')
    },

    init() {
        // Tab Events
        this.elements.tabs[MODULE.WEEDING].onclick = (e) => this.switchTab(e, MODULE.WEEDING);
        this.elements.tabs[MODULE.SEGMENTATION].onclick = (e) => this.switchTab(e, MODULE.SEGMENTATION);

        // Weeding Actions
        this.elements.runButton.onclick = () => {
            const target = this.elements.weedingTarget.value;
            Poller.start(MODULE.WEEDING, { target_folder: target });
        };
        this.elements.cancelButton.onclick = () => Poller.cancel(MODULE.WEEDING);

        // Segmentation Actions
        this.elements.runPdfButton.onclick = () => {
            const target = this.elements.pdfTarget.value;
            const mb = this.elements.pdfMaxSize.value;
            const pages = this.elements.pdfPageCount.value;
            Poller.start(MODULE.SEGMENTATION, {
                target_folder: target,
                max_size_mb: mb,
                initial_page_count: pages
            });
        };

        // Subscribe
        State.subscribe((state, event) => this.render(state, event));
    },

    switchTab(evt, module) {
        this.activeModule = module;

        // Update Classes
        Object.values(this.elements.sections).forEach(el => el.classList.remove('active'));
        Object.values(this.elements.tabs).forEach(el => el.classList.remove('active'));

        this.elements.sections[module].classList.add('active');
        this.elements.tabs[module].classList.add('active');

        // Re-render to show status of the now active tab
        this.render(State, null);
    },

    appendLog(text) {
        const div = document.createElement('div');
        div.textContent = text;
        this.elements.output.appendChild(div);
        this.elements.output.scrollTop = this.elements.output.scrollHeight;
    },

    setStatus(status) {
        this.elements.statusText.textContent = status;
        const colors = {
            [STATUS.NOT_STARTED]: "grey",
            [STATUS.RUNNING]: "orange",
            [STATUS.FINISHED]: "green",
            [STATUS.USER_CANCELED]: "blue",
            [STATUS.ERROR]: "red"
        };
        this.elements.statusLabel.style.backgroundColor = colors[status] || 'grey';

        if (status !== STATUS.NOT_STARTED) {
            this.elements.timestamp.textContent = new Date().toLocaleString();
        }
    },

    render(state, event) {
        // 1. Logs
        if (event && event.type === 'log') {
            this.appendLog(event.message);
            return;
        }

        const sWeeding = state.get(MODULE.WEEDING);
        const sPdf = state.get(MODULE.SEGMENTATION);

        // 2. Weeding UI Updates
        this.elements.runButton.disabled = sWeeding.isRunning;
        this.elements.cancelButton.disabled = !sWeeding.isRunning;
        if (sWeeding.isRunning) {
            this.elements.runButton.textContent = "Script Running...";
            this.elements.cancelButton.textContent = "Cancel";
            this.elements.progressContainer.style.display = 'block';
            this.elements.filesChecked.textContent = sWeeding.filesChecked;
            this.elements.totalFiles.textContent = sWeeding.totalFiles;
        } else {
            this.elements.runButton.textContent = "Clean Duplicates";
        }

        // 3. Segmentation UI Updates
        this.elements.runPdfButton.disabled = sPdf.isRunning;
        if (sPdf.isRunning) {
            this.elements.runPdfButton.textContent = "Splitting...";
        } else {
            this.elements.runPdfButton.textContent = "Start Splitting";
        }

        // 4. Shared Status
        const activeState = state.get(this.activeModule);
        this.setStatus(activeState.status);
    }
};
