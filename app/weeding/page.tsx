"use client";

import { useTerminal } from "@/context/TerminalContext";
import { useState } from "react";

export default function WeedingPage() {
    const { addLog } = useTerminal();
    const [targetPath, setTargetPath] = useState("");

    const handleStart = () => {
        if (!targetPath) {
            addLog("Target folder path is required", "error");
            return;
        }

        addLog(`Initializing Weeding Process...`, "warn");
        addLog(`Target: ${targetPath}`, "info");

        // Simulate process
        setTimeout(() => {
            addLog("Scanning for duplicates...", "info");
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--bg-card)] border border-[var(--border-dim)] p-8 shadow-lg">
                <h3 className="font-mono text-xl text-white mb-6 border-b border-[var(--border-dim)] pb-4 flex items-center">
                    <i className="fa-solid fa-trash-can mr-3 text-[var(--accent-primary)]"></i>
                    WEEDING_TOOL_CONFIG
                </h3>

                <div className="space-y-6">
                    {/* Target Folder Input */}
                    <div className="space-y-2">
                        <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                            Target Folder (Absolute Path)
                        </label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-[var(--border-dim)] bg-[var(--bg-input)] text-gray-400">
                                <i className="fa-solid fa-folder-open text-xs"></i>
                            </span>
                            <input
                                type="text"
                                value={targetPath}
                                onChange={(e) => setTargetPath(e.target.value)}
                                placeholder="/path/to/directory"
                                className="flex-1 block w-full rounded-none rounded-r bg-[#09161c] border border-[var(--border-dim)] text-white px-4 py-2.5 focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none font-mono text-sm placeholder-gray-600 transition-all"
                            />
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono">
                            The directory to scan for duplicate files. Recursive scan is enabled by default.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-[var(--border-dim)] flex justify-end">
                        <button
                            onClick={handleStart}
                            className="bg-[var(--accent-primary)] text-[#09161c] hover:opacity-90 px-8 py-3 rounded-sm font-bold font-mono tracking-wide transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                        >
                            <i className="fa-solid fa-play mr-2"></i>
                            Start
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
