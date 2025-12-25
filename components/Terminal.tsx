"use client";

import { useTerminal } from "@/context/TerminalContext";
import { useEffect, useRef } from "react";

export default function Terminal() {
    const { logs, clearLogs, viewMode, setViewMode, logFilePath, lastUpdated } = useTerminal();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, viewMode]);

    const getHeightClass = () => {
        switch (viewMode) {
            case "collapsed":
                return "h-8";
            case "max":
                return "h-[70%]";
            case "normal":
            default:
                return "h-64";
        }
    };

    const toggleSize = () => {
        if (viewMode === "normal") {
            setViewMode("max");
        } else {
            setViewMode("normal");
        }
    };

    return (
        <div
            className={`bg-[#060f13] border-t-2 border-[var(--border-dim)] flex flex-col transition-all duration-300 ease-in-out ${getHeightClass()}`}
        >
            {/* Toolbar / StatusBar */}
            <div className="h-8 bg-[#0d2029] flex items-center justify-between px-4 border-b border-[var(--border-dim)] shrink-0">

                {/* Left: Title */}
                <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-terminal text-[var(--accent-primary)] text-xs"></i>
                    <span className="text-xs font-mono text-[var(--text-muted)] tracking-wider">
                        CONSOLE
                    </span>
                </div>

                {/* Right: Log File + Last Updated + Controls */}
                <div className="flex items-center space-x-4">

                    <div className="flex items-center space-x-2 text-xs font-mono">
                        <span className="text-[var(--text-muted)]">Log File:</span>
                        <a
                            href={logFilePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--accent-primary)] hover:underline truncate max-w-[200px]"
                        >
                            {logFilePath}
                        </a>
                    </div>

                    <div className="w-[1px] h-3 bg-[var(--border-dim)]"></div>

                    {/* Last Updated */}
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">
                        Last Updated: <span className="text-gray-300">{lastUpdated || "--:--:--"}</span>
                    </div>

                    <div className="w-[1px] h-3 bg-[var(--border-dim)]"></div>

                    <div className="flex items-center space-x-1">
                        {/* Button 1: Minimize / Restore */}
                        <button
                            onClick={() => setViewMode(viewMode === "collapsed" ? "normal" : "collapsed")}
                            className={`text-[var(--text-muted)] hover:text-white transition-colors w-6 text-center`}
                            title={viewMode === "collapsed" ? "Restore" : "Minimize"}
                        >
                            <i className={`fa-solid ${viewMode === "collapsed" ? "fa-window-maximize" : "fa-window-minimize"} text-xs relative bottom-[2px]`}></i>
                        </button>

                        {/* Button 2: Size Toggle (Normal/Max) - Only visible if not collapsed */}
                        {viewMode !== "collapsed" && (
                            <button
                                onClick={toggleSize}
                                className={`text-[var(--text-muted)] hover:text-white transition-colors w-6 text-center`}
                                title={viewMode === "max" ? "Restore Down" : "Maximize"}
                            >
                                <i className={`fa-regular ${viewMode === "max" ? "fa-window-restore" : "fa-square"} text-xs`}></i>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Logs Area */}
            {viewMode !== "collapsed" && (
                <div
                    ref={scrollRef}
                    className="flex-1 p-4 overflow-y-auto font-mono text-xs md:text-sm bg-[#060f13]"
                >
                    {logs.length === 0 ? (
                        <div className="text-gray-600 italic">No output to display...</div>
                    ) : (
                        <div className="space-y-1">
                            {logs.map((log) => (
                                <div key={log.id} className="flex items-start">
                                    <span className="text-[#556d7a] mr-3 select-none flex-shrink-0">
                                        [{log.timestamp}]
                                    </span>
                                    <span
                                        className={`font-bold mr-2 select-none flex-shrink-0 ${log.type === "error"
                                            ? "text-red-500"
                                            : log.type === "success"
                                                ? "text-[var(--accent-primary)]"
                                                : log.type === "warn"
                                                    ? "text-yellow-500"
                                                    : log.type === "system"
                                                        ? "text-blue-400"
                                                        : "text-gray-400"
                                            }`}
                                    >
                                        {log.type === "error"
                                            ? "ERR "
                                            : log.type === "success"
                                                ? "OKAY"
                                                : log.type === "warn"
                                                    ? "WARN"
                                                    : log.type === "system"
                                                        ? "SYS "
                                                        : "INFO"}
                                    </span>
                                    <span className="text-[#e1e8eb] break-all whitespace-pre-wrap">
                                        {log.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div >
    );
}
