"use client";

import { useState } from "react";

export default function ConfigPage() {
    const [weedingAdvancedOpen, setWeedingAdvancedOpen] = useState(false);
    const [segmentingAdvancedOpen, setSegmentingAdvancedOpen] = useState(false);

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
                                <label className="text-xs text-white font-mono">Host</label>
                                <input type="text" defaultValue="127.0.0.1" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white font-mono">Port</label>
                                <input type="number" defaultValue="2226" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs text-white font-mono">Root Path</label>
                                <input type="text" defaultValue="/path/to/data" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs text-white font-mono">Scripts Directory</label>
                                <input type="text" defaultValue="./python_core" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs text-white font-mono">Virtual Env Path</label>
                                <input type="text" defaultValue="" placeholder="(Optional)" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
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
                                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--accent-primary)]" />
                                    <span className="text-sm font-mono text-white">Dry Run Mode (Safe)</span>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-white font-mono">Log Path</label>
                                    <input type="text" defaultValue="./_data_librarian/logs" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-white font-mono">Log File Prefix</label>
                                    <input type="text" defaultValue="weeding_" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs text-white font-mono">Holding Bin</label>
                                    <input type="text" defaultValue="./_duplicate_bin" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
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
                                        <label className="text-xs text-white font-mono">Included Folders</label>
                                        <textarea rows={2} className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-white font-mono">Excluded Folders</label>
                                        <textarea rows={2} defaultValue='["_duplicate_bin"]' className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-white font-mono">Included Files</label>
                                        <textarea rows={2} className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-white font-mono">Excluded Files</label>
                                        <textarea rows={2} className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-white font-mono">Included Extensions</label>
                                        <input type="text" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-white font-mono">Excluded Extensions</label>
                                        <input type="text" defaultValue='[".tmp", ".bak"]' className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
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
                                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--accent-primary)]" />
                                    <span className="text-sm font-mono text-white">Dry Run Mode (Safe)</span>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-white font-mono">Max File Size (MB)</label>
                                    <input type="number" defaultValue="100" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-white font-mono">Chunk Limit</label>
                                    <input type="number" defaultValue="1000" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-white font-mono">Log Path</label>
                                    <input type="text" defaultValue="./_data_librarian/logs" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-white font-mono">Log File Prefix</label>
                                    <input type="text" defaultValue="segmenting_" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
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
                                        <label className="text-xs text-gray-300 font-mono">Included Folders</label>
                                        <textarea rows={2} className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-300 font-mono">Excluded Folders</label>
                                        <textarea rows={2} className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-300 font-mono">Included Files</label>
                                        <textarea rows={2} className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-300 font-mono">Excluded Files</label>
                                        <textarea rows={2} className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]"></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-300 font-mono">Included Extensions</label>
                                        <input type="text" defaultValue='[".pdf"]' className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-300 font-mono">Excluded Extensions</label>
                                        <input type="text" className="w-full bg-[#09161c] border border-[var(--border-dim)] text-white px-3 py-2 text-sm font-mono focus:border-[var(--accent-primary)] outline-none" placeholder="[]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* BOTTOM SAVE BUTTON */}
                <div className="flex justify-end pt-8 border-t border-[var(--border-dim)] mt-8">
                    <button className="bg-[var(--accent-primary)] text-[#09161c] hover:opacity-90 px-8 py-3 rounded-sm font-bold font-mono tracking-wide transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                        <i className="fa-solid fa-save mr-2"></i>
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
