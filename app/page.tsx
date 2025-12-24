"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"cleaner" | "pdf">("cleaner");

  // State for inputs (defaults from index.html)
  const [targetFolder, setTargetFolder] = useState("/path/to/folder");
  const [pdfTargetFolder, setPdfTargetFolder] = useState("/path/to/folder");
  const [pdfMaxSize, setPdfMaxSize] = useState("100");
  const [pdfPageCount, setPdfPageCount] = useState("1000");

  // Mock status
  const statusText = "Not Started";
  const logFilePath = "/path/to/log/file.log";
  const outputLog = "Ready...";

  return (
    <div className="flex flex-row h-screen font-sans text-white bg-[var(--background)]">
      {/* Left Panel */}
      <div className="w-[30%] min-w-[300px] bg-zinc-800 p-5 flex flex-col gap-5 border-r border-zinc-700">
        <h1 className="text-4xl text-center text-white font-eagle-lake my-0">
          The Data Librarian
        </h1>

        {/* Tabs */}
        <div className="flex w-full mb-0">
          <button
            onClick={() => setActiveTab("cleaner")}
            className={`flex-1 py-3 px-5 text-base cursor-pointer transition-colors duration-300 border-none ${activeTab === "cleaner"
                ? "bg-[#A067E6] text-white font-bold"
                : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              }`}
          >
            Cleaner
          </button>
          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex-1 py-3 px-5 text-base cursor-pointer transition-colors duration-300 border-none ${activeTab === "pdf"
                ? "bg-[#A067E6] text-white font-bold"
                : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              }`}
          >
            PDF Splitter
          </button>
        </div>

        {/* Cleaner Section */}
        {activeTab === "cleaner" && (
          <div className="flex flex-col flex-grow animate-in fade-in duration-300">
            <div className="mb-4">
              <label className="block text-gray-400 mb-1.5" htmlFor="duplicate-target-folder">
                Target Folder (Absolute Path)
              </label>
              <input
                type="text"
                id="duplicate-target-folder"
                value={targetFolder}
                onChange={(e) => setTargetFolder(e.target.value)}
                className="w-full p-2 bg-zinc-700 border border-zinc-600 text-white rounded focus:outline-none focus:border-[#A067E6]"
                placeholder="/path/to/folder"
              />
            </div>

            <div className="flex-grow"></div>

            <div className="flex flex-col gap-2 w-full mt-4">
              <button className="w-full py-3 px-6 text-lg rounded bg-green-600 hover:bg-green-700 text-white font-medium transition-colors cursor-pointer">
                Clean Duplicates
              </button>
              <button disabled className="w-full py-3 px-6 text-lg rounded bg-gray-400 text-gray-600 cursor-not-allowed font-medium">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* PDF Splitter Section */}
        {activeTab === "pdf" && (
          <div className="flex flex-col flex-grow animate-in fade-in duration-300">
            <div className="mb-4">
              <label className="block text-gray-400 mb-1.5" htmlFor="pdf-target-folder">
                Target Folder (Absolute Path)
              </label>
              <input
                type="text"
                id="pdf-target-folder"
                value={pdfTargetFolder}
                onChange={(e) => setPdfTargetFolder(e.target.value)}
                className="w-full p-2 bg-zinc-700 border border-zinc-600 text-white rounded focus:outline-none focus:border-[#A067E6]"
                placeholder="/path/to/folder"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-1.5" htmlFor="pdf-max-size">
                Max File Size (MB)
              </label>
              <input
                type="number"
                id="pdf-max-size"
                value={pdfMaxSize}
                onChange={(e) => setPdfMaxSize(e.target.value)}
                className="w-full p-2 bg-zinc-700 border border-zinc-600 text-white rounded focus:outline-none focus:border-[#A067E6]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-1.5" htmlFor="pdf-page-count">
                Initial Page Count (Est.)
              </label>
              <input
                type="number"
                id="pdf-page-count"
                value={pdfPageCount}
                onChange={(e) => setPdfPageCount(e.target.value)}
                className="w-full p-2 bg-zinc-700 border border-zinc-600 text-white rounded focus:outline-none focus:border-[#A067E6]"
              />
            </div>

            <div className="flex-grow"></div>

            <div className="flex flex-col gap-2 w-full mt-4">
              <button className="w-full py-3 px-6 text-lg rounded bg-[#673ab7] hover:bg-[#512da8] text-white font-medium transition-colors cursor-pointer">
                Start Splitting
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-[var(--background)] p-5 flex flex-col h-screen overflow-hidden">
        <div className="flex justify-between items-center w-full mb-2">
          <h1>
            <div className="py-2.5 px-5 rounded bg-gray-500 text-white text-base text-center w-[150px]">
              {statusText}
            </div>
          </h1>
        </div>

        <div className="flex flex-row justify-between w-full items-end mb-2.5 text-sm text-gray-400">
          <div className="break-all text-white">Log File: <span className="font-mono">{logFilePath}</span></div>
          <div>Log Last Updated: <span className="font-mono">--:--:--</span></div>
        </div>

        <div className="flex-grow bg-[#212121] p-5 overflow-auto font-mono text-white text-sm whitespace-pre rounded">
          {outputLog}
        </div>
      </div>
    </div>
  );
}
