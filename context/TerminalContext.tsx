"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type LogType = "info" | "success" | "error" | "warn" | "system";

interface LogEntry {
    id: string;
    timestamp: string;
    message: string;
    type: LogType;
}

interface TerminalContextType {
    logs: LogEntry[];
    addLog: (message: string, type?: LogType) => void;
    clearLogs: () => void;
    isOpen: boolean; // Is it visible (height > 0)
    viewMode: "collapsed" | "normal" | "max";
    setViewMode: (mode: "collapsed" | "normal" | "max") => void;
    logFilePath: string;
    setLogFilePath: (path: string) => void;
    lastUpdated: string | null;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export function TerminalProvider({ children }: { children: ReactNode }) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [viewMode, setViewMode] = useState<"collapsed" | "normal" | "max">("normal");
    const [logFilePath, setLogFilePath] = useState<string>("/var/log/data_librarian/latest.log");
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const addLog = (message: string, type: LogType = "info") => {
        const now = new Date();
        const timeString = now.toLocaleTimeString("en-US", { hour12: false });
        const newLog: LogEntry = {
            id: crypto.randomUUID(),
            timestamp: timeString,
            message,
            type,
        };
        setLogs((prev) => [...prev, newLog]);
        setLastUpdated(timeString);
    };

    const clearLogs = () => setLogs([]);

    return (
        <TerminalContext.Provider
            value={{
                logs,
                addLog,
                clearLogs,
                isOpen: viewMode !== "collapsed",
                viewMode,
                setViewMode,
                logFilePath,
                setLogFilePath,
                lastUpdated
            }}
        >
            {children}
        </TerminalContext.Provider>
    );
}

export function useTerminal() {
    const context = useContext(TerminalContext);
    if (context === undefined) {
        throw new Error("useTerminal must be used within a TerminalProvider");
    }
    return context;
}
