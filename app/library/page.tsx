import FileTree from "@/components/library/FileTree";
import fs from "fs";
import path from "path";

// Helper to recursively read directory
function getDirectoryStructure(dirPath: string): any[] {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    return items.map((item) => {
        const isDirectory = item.isDirectory();
        const itemPath = path.join(dirPath, item.name);

        return {
            name: item.name,
            type: isDirectory ? "directory" : "file",
            // Only recurse if it's a directory
            children: isDirectory ? getDirectoryStructure(itemPath) : undefined,
            size: !isDirectory ? formatBytes(fs.statSync(itemPath).size) : undefined
        };
    });
}

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function LibraryPage() {
    const testDataPath = path.join(process.cwd(), "test_data");
    let fileData: any[] = [];

    try {
        if (fs.existsSync(testDataPath)) {
            fileData = getDirectoryStructure(testDataPath);
        }
    } catch (error) {
        console.error("Error reading test_data:", error);
    }

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-mono text-xl text-white flex items-center">
                    <i className="fa-solid fa-book mr-3 text-[var(--accent-primary)]"></i>
                    LIBRARY_INDEX
                </h3>
                <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-input)] px-2 py-1 rounded border border-[var(--border-dim)]">
                    /test_data
                </span>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                <FileTree data={fileData} />
            </div>
        </div>
    );
}
