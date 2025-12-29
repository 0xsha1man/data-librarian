"use client";

import { useTerminal } from "@/context/TerminalContext";
import { DataLibrarian } from "@/lib/head_librarian";
import { ConfigSchema, type ConfigType } from "@/lib/schemas";
import { useEffect, useState } from "react";

// Helper to safely parse/stringify array inputs (textarea)
const parseArrayInput = (val: string) => {
    try { return JSON.parse(val); } catch { return []; }
};
const formatArrayInput = (val: any) => JSON.stringify(val);


export default function ConfigPage() {
    const { setViewMode } = useTerminal();
    const [config, setConfig] = useState<ConfigType | null>(null);
    const [loading, setLoading] = useState(true);
    const [weedingAdvancedOpen, setWeedingAdvancedOpen] = useState(false);
    const [segmentingAdvancedOpen, setSegmentingAdvancedOpen] = useState(false);

    useEffect(() => {
        // Auto-minimize console on this page
        setViewMode("collapsed");

        const fetchConfig = async () => {
            // Use HeadLibrarian for Caching
            const res = await DataLibrarian.HeadLibrarian.getConfig();
            if (res.success && res.data) {
                // Basic casting as we know the structure from backend
                setConfig(res.data as ConfigType);
            } else {
                alert("Failed to load configuration");
            }
            setLoading(false);
        };
        fetchConfig();
    }, [setViewMode]);

    const handleSave = async () => {
        if (!config) return;

        // validate
        const result = ConfigSchema.safeParse(config);
        if (!result.success) {
            console.error(result.error);
            alert("Validation failed! Check console for details.");
            return;
        }

        // Use HeadLibrarian for Caching update
        const res = await DataLibrarian.HeadLibrarian.saveConfig(config);
        if (res.success) {
            alert("Configuration saved successfully!");
        } else {
            alert("Failed to save configuration: " + res.error);
        }
    };

    // Generic updater for nested objects
    const update = (section: keyof ConfigType, key: string, value: any) => {
        if (!config) return;
        setConfig({
            ...config,
            [section]: {
                ...config[section],
                [key]: value
            }
        });
    };

    if (loading) return <div className="p-8 text-[var(--accent-primary)] font-mono">Loading configuration...</div>;
    if (!config || !config.server) return (
        <div className="p-8 text-error font-mono">
            <h3 className="font-bold">Configuration Invalid</h3>
            <p>The configuration could not be loaded correctly or is missing required sections.</p>
            <pre className="bg-[var(--bg-black)] p-4 mt-2 overflow-auto text-xs">
                {JSON.stringify(config, null, 2)}
            </pre>
            <button
                onClick={() => {
                    DataLibrarian.HeadLibrarian.flushConfig();
                    window.location.reload();
                }}
                className="mt-4 bg-[var(--accent-primary)] text-black px-4 py-2 font-bold text-sm hover:opacity-90"
            >
                Clear Cache & Reload
            </button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="bg-[var(--bg-card)] border border-[var(--border-dim)] p-8 shadow-lg">
                <h3 className="font-mono text-xl text-secondary mb-6 border-b border-[var(--border-dim)] pb-4 flex items-center">
                    <i className="fa-solid fa-gear mr-3 text-[var(--accent-primary)]"></i>
                    SYSTEM_CONFIGURATION
                </h3>

                <div className="space-y-8">
                    {/* SERVER SECTION */}
                    <section>
                        <h4 className="text-sm font-bold font-mono text-[var(--text-muted)] uppercase tracking-wider mb-4 border-l-2 border-[var(--accent-primary)] pl-3">
                            [Server_Settings]
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--bg-input)]/30 p-3 border border-[var(--border-dim)]">
                            <div className="space-y-1">
                                <label className="text-xs text-[var(--text-main)] font-mono">Host</label>
                                <input type="text" value={config.server.host} onChange={(e) => update('server', 'host', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-[var(--text-main)] font-mono">Backend Port</label>
                                <input type="number" value={config.server.port} onChange={(e) => update('server', 'port', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-[var(--text-main)] font-mono">Frontend Port</label>
                                <input type="number" value={config.server.frontend_port || 3000} onChange={(e) => update('server', 'frontend_port', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs text-[var(--text-main)] font-mono">Root Path</label>
                                <input type="text" value={config.server.root_path} onChange={(e) => update('server', 'root_path', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs text-[var(--text-main)] font-mono">Scripts Directory</label>
                                <input type="text" value={config.server.scripts_dir} onChange={(e) => update('server', 'scripts_dir', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                            </div>

                        </div>
                    </section>

                    {/* WEEDING SECTION */}
                    <section>
                        <h4 className="text-sm font-bold font-mono text-[var(--text-muted)] uppercase tracking-wider mb-4 border-l-2 border-error pl-3">
                            [Weeding_Module]
                        </h4>
                        <div className="bg-[var(--bg-input)]/30 p-3 border border-[var(--border-dim)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center space-x-3 md:col-span-2 border-b border-[var(--border-dim)] pb-4">
                                    <input type="checkbox" checked={config.weeding.dry_run_mode} onChange={(e) => update('weeding', 'dry_run_mode', e.target.checked)} className="h-4 w-4 accent-[var(--accent-primary)]" />
                                    <span className="text-sm font-mono text-[var(--text-main)]">Dry Run Mode (Safe)</span>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-[var(--text-main)] font-mono">Log Path</label>
                                    <input type="text" value={config.weeding.log_path} onChange={(e) => update('weeding', 'log_path', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-[var(--text-main)] font-mono">Log File Prefix</label>
                                    <input type="text" value={config.weeding.log_file_prefix} onChange={(e) => update('weeding', 'log_file_prefix', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs text-[var(--text-main)] font-mono">Holding Bin</label>
                                    <input type="text" value={config.weeding.holding_bin} onChange={(e) => update('weeding', 'holding_bin', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                </div>
                            </div>

                            {/* Collapsible Advanced */}
                            <button
                                onClick={() => setWeedingAdvancedOpen(!weedingAdvancedOpen)}
                                className="flex items-center text-xs text-[var(--text-muted)] hover:text-white mb-4 w-full border-t border-[var(--border-dim)] pt-2 mt-2"
                            >
                                <i className={`fa-solid fa-chevron-right mr-2 transition-transform ${weedingAdvancedOpen ? "rotate-90" : ""}`}></i>
                                Advanced Filters (Includes/Excludes)
                            </button>

                            {weedingAdvancedOpen && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-main)] font-mono">Included Folders</label>
                                        <textarea rows={2} value={formatArrayInput(config.weeding.included_folders)} onChange={(e) => update('weeding', 'included_folders', parseArrayInput(e.target.value))} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-main)] font-mono">Excluded Folders</label>
                                        <textarea rows={2} value={formatArrayInput(config.weeding.excluded_folders)} onChange={(e) => update('weeding', 'excluded_folders', parseArrayInput(e.target.value))} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-main)] font-mono">Included Files</label>
                                        <textarea rows={2} value={formatArrayInput(config.weeding.included_files)} onChange={(e) => update('weeding', 'included_files', parseArrayInput(e.target.value))} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-main)] font-mono">Excluded Files</label>
                                        <textarea rows={2} value={formatArrayInput(config.weeding.excluded_files)} onChange={(e) => update('weeding', 'excluded_files', parseArrayInput(e.target.value))} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-main)] font-mono">Included Extensions</label>
                                        <input type="text" value={formatArrayInput(config.weeding.included_extensions)} onChange={(e) => update('weeding', 'included_extensions', parseArrayInput(e.target.value))} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-main)] font-mono">Excluded Extensions</label>
                                        <input type="text" value={formatArrayInput(config.weeding.excluded_extensions)} onChange={(e) => update('weeding', 'excluded_extensions', parseArrayInput(e.target.value))} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* SEGMENTING SECTION */}
                    <section>
                        <h4 className="text-sm font-bold font-mono text-[var(--text-muted)] uppercase tracking-wider mb-4 border-l-2 border-info pl-3">
                            [Segmenting_Module]
                        </h4>
                        <div className="bg-[var(--bg-input)]/30 p-3 border border-[var(--border-dim)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center space-x-3 md:col-span-2 border-b border-[var(--border-dim)] pb-4">
                                    <input type="checkbox" checked={config.segmenting.dry_run_mode} onChange={(e) => update('segmenting', 'dry_run_mode', e.target.checked)} className="h-4 w-4 accent-[var(--accent-primary)]" />
                                    <span className="text-sm font-mono text-[var(--text-main)]">Dry Run Mode (Safe)</span>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-[var(--text-main)] font-mono">Max File Size (MB)</label>
                                    <input type="number" value={config.segmenting.max_mb} onChange={(e) => update('segmenting', 'max_mb', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-[var(--text-main)] font-mono">Chunk Limit</label>
                                    <input type="number" value={config.segmenting.chunk_limit} onChange={(e) => update('segmenting', 'chunk_limit', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-[var(--text-main)] font-mono">Log Path</label>
                                    <input type="text" value={config.segmenting.log_path} onChange={(e) => update('segmenting', 'log_path', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-[var(--text-main)] font-mono">Log File Prefix</label>
                                    <input type="text" value={config.segmenting.log_file_prefix} onChange={(e) => update('segmenting', 'log_file_prefix', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                </div>
                            </div>

                            {/* Collapsible Advanced */}
                            <button
                                onClick={() => setSegmentingAdvancedOpen(!segmentingAdvancedOpen)}
                                className="flex items-center text-xs text-[var(--text-muted)] hover:text-white mb-4 w-full border-t border-[var(--border-dim)] pt-2 mt-2"
                            >
                                <i className={`fa-solid fa-chevron-right mr-2 transition-transform ${segmentingAdvancedOpen ? "rotate-90" : ""}`}></i>
                                Advanced Filters (Includes/Excludes)
                            </button>

                            {segmentingAdvancedOpen && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-main)] font-mono">Included Folders</label>
                                        <textarea rows={2} value={formatArrayInput(config.segmenting.included_folders)} onChange={(e) => update('segmenting', 'included_folders', parseArrayInput(e.target.value))} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-main)] font-mono">Excluded Folders</label>
                                        <textarea rows={2} value={formatArrayInput(config.segmenting.excluded_folders)} onChange={(e) => update('segmenting', 'excluded_folders', parseArrayInput(e.target.value))} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-main)] font-mono">Included Files</label>
                                        <textarea rows={2} value={formatArrayInput(config.segmenting.included_files)} onChange={(e) => update('segmenting', 'included_files', parseArrayInput(e.target.value))} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-main)] font-mono">Excluded Files</label>
                                        <textarea rows={2} value={formatArrayInput(config.segmenting.excluded_files)} onChange={(e) => update('segmenting', 'excluded_files', parseArrayInput(e.target.value))} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-main)] font-mono">Included Extensions</label>
                                        <input type="text" value={formatArrayInput(config.segmenting.included_extensions)} onChange={(e) => update('segmenting', 'included_extensions', parseArrayInput(e.target.value))} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-main)] font-mono">Excluded Extensions</label>
                                        <input type="text" value={formatArrayInput(config.segmenting.excluded_extensions)} onChange={(e) => update('segmenting', 'excluded_extensions', parseArrayInput(e.target.value))} className="w-full bg-[var(--bg-dark)] border border-[var(--border-dim)] text-[var(--text-main)] px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* BOTTOM SAVE BUTTON */}
                <div className="flex justify-end pt-8 border-t border-[var(--border-dim)] mt-8">
                    <button onClick={handleSave} className="bg-[var(--accent-primary)] text-[#09161c] hover:opacity-90 px-8 py-3 rounded-sm font-bold font-mono tracking-wide transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                        <i className="fa-solid fa-save mr-2"></i>
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
