"use client";

import { useState } from "react";

interface FileNode {
    name: string;
    type: "file" | "directory";
    children?: FileNode[];
    size?: string;
}

const FileIcon = ({ name, type }: { name: string; type: "file" | "directory" }) => {
    if (type === "directory") return <i className="fa-solid fa-folder text-[var(--accent-primary)] mr-2"></i>;

    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case "pdf": return <i className="fa-regular fa-file-pdf text-error mr-2"></i>;
        case "txt": return <i className="fa-regular fa-file-lines text-gray-400 mr-2"></i>;
        case "json": return <i className="fa-solid fa-file-code text-secondary mr-2"></i>;
        case "mp4":
        case "mkv": return <i className="fa-regular fa-file-video text-purple-500 mr-2"></i>;
        case "mp3": return <i className="fa-regular fa-file-audio text-purple-400 mr-2"></i>;
        default: return <i className="fa-regular fa-file text-[var(--text-muted)] mr-2"></i>;
    }
};

const TreeNode = ({ node, level }: { node: FileNode; level: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (node.type === "directory") {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div>
            <div
                className={`flex items-center py-1 px-2 cursor-pointer hover:bg-[var(--bg-input)] transition-colors select-none text-sm font-mono`}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
                onClick={handleClick}
            >
                <span className="w-4 text-center mr-1 text-[var(--text-muted)]">
                    {node.type === "directory" && (
                        <i className={`fa-solid fa-chevron-right text-[10px] transition-transform ${isOpen ? "rotate-90" : ""}`}></i>
                    )}
                </span>
                <FileIcon name={node.name} type={node.type} />
                <span className={`${node.type === "directory" ? "font-bold text-white" : "text-gray-300"}`}>
                    {node.name}
                </span>
                {node.size && <span className="ml-auto text-xs text-[var(--text-muted)]">{node.size}</span>}
            </div>
            {isOpen && node.children && (
                <div>
                    {node.children.map((child, idx) => (
                        <TreeNode key={`${child.name}-${idx}`} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function FileTree({ data }: { data: FileNode[] }) {
    return (
        <div className="border border-[var(--border-dim)] bg-[var(--bg-card)] min-h-[500px]">
            <div className="bg-[var(--bg-panel)] px-4 py-2 border-b border-[var(--border-dim)] flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">Explorer</span>
                <div className="space-x-2">
                    <button className="text-[var(--text-muted)] hover:text-white"><i className="fa-solid fa-plus text-xs"></i></button>
                    <button className="text-[var(--text-muted)] hover:text-white"><i className="fa-solid fa-rotate-right text-xs"></i></button>
                </div>
            </div>
            <div className="py-2">
                {data.map((node, idx) => (
                    <TreeNode key={`${node.name}-${idx}`} node={node} level={0} />
                ))}
            </div>
        </div>
    );
}
