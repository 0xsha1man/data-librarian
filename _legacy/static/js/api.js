/**
 * api.js
 * Handles all server communication.
 * Generic functions using internal mapping.
 */

const API = {
    // Endpoints Mapping
    endpoints: {
        [MODULE.WEEDING]: {
            status: '/check_status',
            output: '/get_output',
            run: '/run_script',
            cancel: '/cancel_script'
        },
        [MODULE.SEGMENTATION]: {
            status: '/check_pdf_status',
            output: '/get_pdf_output',
            run: '/run_pdf_splitter',
            cancel: null // Not implemented in backend
        }
    },

    // --- Generic Fetch Wrapper ---
    async _fetch(url, options = {}) {
        if (!url) throw new Error("Endpoint not implemented for this module.");

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error (${url}):`, error);
            throw error;
        }
    },

    async _post(url, data) {
        return this._fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },

    // --- Generic Methods ---
    async checkStatus(module) {
        return this._fetch(this.endpoints[module].status);
    },

    async getOutput(module) {
        return this._fetch(this.endpoints[module].output);
    },

    async runScript(module, payload) {
        return this._post(this.endpoints[module].run, payload);
    },

    async cancelScript(module) {
        return this._fetch(this.endpoints[module].cancel);
    }
};
