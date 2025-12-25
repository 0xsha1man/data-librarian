"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-[var(--bg-panel)] border-r border-[var(--border-dim)] flex flex-col z-20 h-full">
            <div className="h-16 flex items-center justify-center border-b border-[var(--border-dim)] bg-[#050b0e]">
                <img src="/logo.png" alt="Data Librarian" className="h-10 w-auto brightness-0 invert opacity-90" />
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-0.5">
                <Link
                    href="/dashboard"
                    className={`flex items-center px-6 py-2 text-[var(--text-main)] transition-all border-l-2 ${isActive("/dashboard")
                        ? "bg-[var(--bg-input)] border-[var(--accent-primary)] text-white"
                        : "border-transparent hover:bg-[var(--bg-input)] hover:border-[var(--accent-primary)] text-gray-400 hover:text-white"
                        }`}
                >
                    <i className="fa-solid fa-chart-line text-sm w-6 mr-3 text-[var(--accent-primary)]"></i>
                    <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <Link
                    href="/library"
                    className={`flex items-center px-6 py-2 text-[var(--text-main)] transition-all border-l-2 ${isActive("/library")
                        ? "bg-[var(--bg-input)] border-[var(--accent-primary)] text-white"
                        : "border-transparent hover:bg-[var(--bg-input)] hover:border-[var(--accent-primary)] text-gray-400 hover:text-white"
                        }`}
                >
                    <i className="fa-solid fa-book text-sm w-6 mr-3 text-[var(--accent-primary)]"></i>
                    <span className="text-sm font-medium">Library</span>
                </Link>

                <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-secondary uppercase tracking-wider font-mono opacity-80">
                    Core Modules
                </div>
                <Link
                    href="/weeding"
                    className={`flex items-center px-6 py-2 text-[var(--text-main)] transition-all border-l-2 ${isActive("/weeding")
                        ? "bg-[var(--bg-input)] border-[var(--accent-primary)] text-white"
                        : "border-transparent hover:bg-[var(--bg-input)] hover:border-[var(--accent-primary)] text-gray-400 hover:text-white"
                        }`}
                >
                    <i className="fa-solid fa-trash-can text-sm w-6 mr-3 text-[var(--accent-primary)]"></i>
                    <span className="text-sm font-medium">Weeding</span>
                </Link>
                <Link
                    href="/segmenting"
                    className={`flex items-center px-6 py-2 text-[var(--text-main)] transition-all border-l-2 ${isActive("/segmenting")
                        ? "bg-[var(--bg-input)] border-[var(--accent-primary)] text-white"
                        : "border-transparent hover:bg-[var(--bg-input)] hover:border-[var(--accent-primary)] text-gray-400 hover:text-white"
                        }`}
                >
                    <i className="fa-regular fa-file-pdf text-sm w-6 mr-3 text-[var(--accent-primary)]"></i>
                    <span className="text-sm font-medium">Segmenting</span>
                </Link>
            </nav>

            {/* Footer / Settings */}
            <div className="p-3 border-t border-[var(--border-dim)] bg-[#050b0e]">
                <Link
                    href="/config"
                    className={`flex items-center px-4 py-2 rounded transition-colors ${isActive("/config")
                        ? "text-[var(--accent-primary)] bg-[var(--bg-input)] font-bold"
                        : "text-gray-400 hover:text-white hover:bg-[var(--bg-input)]"
                        }`}
                >
                    <i className="fa-solid fa-gear text-lg mr-3 text-[var(--accent-primary)]"></i>
                    <span className="text-sm font-medium">Settings</span>
                </Link>
            </div>
        </aside>
    );
}
