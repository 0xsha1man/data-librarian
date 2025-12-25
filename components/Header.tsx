"use client";

import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const getTitle = () => {
        switch (pathname) {
            case "/dashboard":
                return "DASHBOARD";
            case "/weeding":
                return "WEEDING_TOOL";
            case "/segmenting":
                return "SEGMENTING_TOOL";
            case "/library":
                return "LIBRARY_INDEX";
            case "/config":
                return "CONFIGURATION";
            default:
                return "DL_SYSTEM_V2";
        }
    };

    // Mock status for now - in real app this would come from a Context/Store
    const status = "RUNNING"; // STOPPED, RUNNING, CANCELLED

    const getStatusColor = () => {
        if (status === "RUNNING") return "text-[var(--accent-primary)] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]";
        if (status === "STOPPED") return "text-gray-400"; // Gray/Dim
        if (status === "CANCELLED") return "text-warning drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]";
        return "text-[#4a5568]";
    };

    return (
        <header className="h-16 bg-[var(--bg-panel)]/90 backdrop-blur-sm border-b border-[var(--border-dim)] flex items-center justify-between px-6 sticky top-0 z-10 w-full">
            <div className="flex items-center space-x-4">
                <h2 className="text-xl font-mono text-secondary tracking-wide">
                    {getTitle()}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-input)] border border-[var(--border-dim)] text-[var(--text-main)]">
                    v2.5.0-beta
                </span>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center border border-[var(--border-dim)] bg-[var(--bg-input)] px-4 py-1.5 rounded-sm">
                    <span className="text-[10px] font-mono text-secondary mr-3 tracking-widest">SYSTEM_STATUS</span>
                    <i className={`fa-solid fa-circle text-[10px] mr-2 ${getStatusColor()}`}></i>
                    <span className={`text-sm font-bold font-mono tracking-wider ${getStatusColor()}`}>
                        {status}
                    </span>
                </div>
            </div>
        </header>
    );
}
