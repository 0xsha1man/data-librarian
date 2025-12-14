# The Data Librarian - Duplicate File Cleaner

This is a Python-based application designed to scan a specified directory (and its subdirectories) for duplicate files based on their content (SHA256 hash) and move them to a designated "holding" folder for review. It provides a simple web-based user interface to start, stop, and monitor the process.

## Features

* **Duplicate Detection:** Uses SHA256 hashing to accurately identify files with identical content, regardless of their filenames.
* **Web Interface:** Provides a simple web UI (accessible at `http://localhost:2226`) to run the scanner, view progress, and see the log output in real-time.
* **Safe Moving:** Moves duplicates to a `_DuplicateHoldingBin` folder, allowing you to manually review and delete them. It does not automatically delete files.
* **Logging:** Generates a unique, timestamped `.txt` log file (e.g., `_duplicate_log_03_22_2025_064633.txt`) in the `_DuplicateHoldingBin` folder for each run, detailing all actions and errors.
* **Configuration:** Allows you to specify folders to exclude from the scan and toggle whether to move files or just report duplicates via the `config.py` file.

## Requirements

* Python 3.x
* No external libraries are required (uses only standard Python libraries).

## Project Files

*   `web_interface.py`: The main script to run. This starts the web server and handles the application logic.
*   `index.html`: The HTML/CSS/JavaScript file that defines the web interface.
*   `utils.py`: Contains helper functions for hashing, logging, and filename sanitization.
*   `config.py`: Contains configuration variables like `EXCLUDED_FOLDERS` and `MOVE_DUPLICATES`.

## Getting Started

Follow these steps to set up and run the application on your computer (Windows, Linux, or Mac).

### Step 1: Install Python
You need to have Python installed.
*   **Windows:** Download and install from [python.org](https://www.python.org/downloads/). Make sure to check the box **"Add Python to PATH"** during installation.
*   **Linux:** Python is usually pre-installed. Open a terminal and type `python3 --version`. If it says "command not found," install it (e.g., `sudo apt install python3` on Ubuntu).

### Step 2: Prepare a Directory
It's best to keep your projects organized. Open your terminal or command prompt (PowerShell on Windows) and run:
```bash
# Create a folder for your projects (optional but recommended)
mkdir Projects
cd Projects
```

### Step 3: Get the Code
Download the code from GitHub. This will create a new folder called `data-librarian` inside your current folder.
```bash
git clone https://github.com/0xsha1man/data-librarian.git
```

### Step 4: Setup
Go into the newly created folder:
```bash
cd data-librarian
```

### Step 5: Run the Application
Run the script using the command appropriate for your system:

**On Windows:**
```bash
python web_interface.py
```

**On Linux / Mac / WSL:**
```bash
python3 web_interface.py
```

### Step 6: Access the Interface
Once the script is running, it will not open a window automatically.
1.  Open your web browser (Chrome, Firefox, etc.).
2.  Type the following address into the address bar and press Enter:
    `http://localhost:2226`

## How to Use the Interface

1.  **Start:** Click the **"Clean Duplicates"** button to begin the scan.
2.  **Monitor:**
    * The status indicator will change to "Running".
    * The log output will appear in the right-hand panel in real-time.
3.  **Cancel:** Click the **"Cancel"** button at any time to stop the process.
4.  **Review:** Once finished, check the `_DuplicateHoldingBin` folder to see moved files and logs.

## Understanding the Log File

### Successful Entry

When a duplicate is found, you will see a message like this:

Duplicate found: Original: ['A Gnostic Prayerbook.pdf'] Duplicate: ['Agnostic Prayer Book Jeremy Puma.pdf'] Moved as: ['Agnostic Prayer Book Jeremy Puma.pdf']

* **Original:** This is the *first* file the script found with this content. This file **is not moved** and stays in its original location.
* **Duplicate:** This is the file that was identified as a duplicate of the original.
* **Moved as:** This confirms the **Duplicate** file was successfully moved to the `_DuplicateHoldingBin` folder. The name shown is the one it will have in the holding bin (after being sanitized).

### Troubleshooting Errors

**`*** ERROR reading file: ... [Errno 22] Invalid argument`**

This is the most common error you might see, especially when running the script over a Remote Desktop (RDP) connection or on a folder that is being actively synced by a cloud service (like iCloud, OneDrive, or Dropbox).

* **Cause:** This error means the operating system blocked Python from reading the file. This often happens when a remote desktop session is minimized, put in the background, or temporarily disconnected (like when switching apps on an iPad). This can cause Windows to suspend or de-prioritize file access for that session. It can also happen if a cloud sync service has locked the file while trying to upload it.
* **Solution:**
    1.  **Run Locally:** The most reliable solution is to run the `web_interface.py` script directly on the machine, not through a remote desktop session from another device (like an iPad).
    2.  **Pause Syncing:** If you are scanning a folder that is synced to the cloud (like your iCloud Drive folder), pause the sync service before running the script.