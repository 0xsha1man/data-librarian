# The Data Librarian

**The Data Librarian** is a comprehensive Python-based suite designed to automate the organization, cleanup, and processing of massive digital archives. Just as a traditional librarian manages a physical collection, this tool helps you curate libraries of research papers, e-books, PDFs, and media files that would otherwise take hours to process by hand.

Whether you are preparing a dataset for AI tools like NotebookLM, cleaning up a sprawling backup drive, or organizing thousands of research documents, The Data Librarian provides a simple, unified web interface to handle the heavy lifting.

## Key Features

*   **Duplicate Detection & Cleanup**: Scans thousands of files to identify exact duplicates using SHA256 hashing. Instead of deleting them immediately, it safely moves them to a "Holding Bin" for your review.
*   **Intelligent PDF Splitter**: Automatically detects large PDF files (e.g., >200MB) and splits them into smaller, manageable chunks. This is essential for compatibility with tools that have strict file size limits.
*   **Web-Base Control**: No complex CLI commands to memorize. Launch the tool once and control everything from a modern, dark-mode web dashboard.
*   **Non-Destructive Operations**: The tool is built with safety first. It never overwrites your original files and always creates copies or moves files to safe locations.

---

## Getting Started

### 1. Prerequisites
You need **Python 3.x** installed on your system.
*   **Windows**: Download from [python.org](https://www.python.org/downloads/). Ensure you check **"Add Python to PATH"** during installation.
*   **Linux/Mac**: Open a terminal and run `python3 --version`. If not found, install via your package manager (e.g., `sudo apt install python3`).

### 2. Installation
1.  **Prepare a Directory**: Create a folder for your tools to keep things organized.
    ```bash
    mkdir Projects
    cd Projects
    ```
2.  **Get the Code**: Clone the repository.
    ```bash
    git clone https://github.com/0xsha1man/data-librarian.git
    cd data-librarian
    ```
3.  **Install Dependencies**:
    ```bash
    pip install pypdf
    ```

### 3. Configuration (`config.py`)
Before running the tool, you can customize its behavior by editing the `config.py` file in a text editor.

| Setting | Default | Description |
| :--- | :--- | :--- |
| **Duplicate Cleanup Settings** | | |
| `EXCLUDED_FOLDERS` | `["_DuplicateHoldingBin"]` | List of folder names to ignore during scans. |
| `DEFAULT_HOLDING_DIR` | `"_DuplicateHoldingBin"` | Name of the folder where duplicates are moved. |
| `MOVE_DUPLICATES` | `False` | **Important**: Set to `True` to actually move files. If `False`, it only logs what *would* happen. |
| **PDF Splitter Settings** | | |
| `PDF_MAX_SIZE_MB` | `180` | PDF files larger than this (in MB) will be triggered for splitting. |
| `PDF_TARGET_CHUNK_MB` | `100` | The goal size for each split part. |
| `PDF_PAGE_CHUNK_LIMIT` | `1000` | Initial guess for pages per chunk. The script adapts this automatically if chunks are too big. |

---

## Using the Web Interface

To start the application, open your terminal in the `data-librarian` folder and run:

**On Windows:**
```bash
python web_interface.py
```

**On Linux / Mac / WSL:**
```bash
python3 web_interface.py
```

Once running, open your web browser and navigate to:
**`http://localhost:2226`**

### The Console Log
The right-hand panel of the interface acts as your **Operations Console**. behavior:
*   **Real-Time Feedback**: It displays exactly what the script is doing (files found, moved, or created) in real-time.
*   **Log Files**: For the Duplicate Cleaner, a permanent log file (`.txt`) is saved in the `_DuplicateHoldingBin` folder for every run, so you have a permanent record of what was moved.

---

## Feature 1: Duplicate File Cleaner

**Best for:** Cleaning up unorganized backups, merging folders, and freeing up storage space.

1.  **Select Tab**: Click the **"Cleaner"** tab.
2.  **Verify Root**: The "Root Folder" displayed is the directory where you ran the script. This is where it will look for duplicates.
3.  **Start**: Click **"Clean Duplicates"**.
4.  **Review**:
    *   The tool calculates hashes for all files.
    *   If a duplicate is found, the *second* copy is moved to `_DuplicateHoldingBin`.
    *   **Note**: The original file is left untouched in its original location.

---

## Feature 2: PDF Splitter

**Best for:** Preparing large libraries of e-books or whitepapers for AI analysis (e.g., NotebookLM) or email sharing.

1.  **Select Tab**: Click the **"PDF Splitter"** tab.
2.  **Target Folder**: Paste the full path of the folder containing your PDF library.
    *   *Tip*: You can copy the path from your file explorer.
3.  **Customize (Optional)**:
    *   Adjust **Max File Size** if you have specific limits (e.g., NotebookLM's 200MB limit).
    *   The **Initial Page Count** is just a starting guess. The script uses an **Adaptive Algorithm**: if it splits a file and a chunk is still too big, it automatically deletes the temp file, recalculates a safer page count, and retries.
4.  **Start**: Click **"Start Splitting"**.
5.  **Result**:
    *   Large files (e.g., `MyBook.pdf`) remain untouched.
    *   New files are created alongside them: `MyBook_part_1-1000.pdf`, `MyBook_part_1001-2000.pdf`, etc.

---

## Troubleshooting

*   **Browser Usage**: The tool does not open the browser automatically (to support server environments). You must manually open `http://localhost:2226`.
*   **"Permission Denied"**: Ensure you have read/write access to the folders you are scanning.
*   **Cloud Folders**: If scanning a synchronized folder (OneDrive, iCloud), pause syncing first to avoid file locking errors.