"""
Configuration settings for The Data Librarian.
Author: Jesse Tudela
"""

# Folders to exclude from the duplicate search
# Add folder names as strings, e.g., ["_DuplicateHoldingBin", "Other Folder"]
EXCLUDED_FOLDERS = ["_DuplicateHoldingBin"]

# Default directory to move duplicate files into
DEFAULT_HOLDING_DIR = "_DuplicateHoldingBin"

# Base name for the log file (timestamp will be appended)
DEFAULT_LOG_FILE = "_duplicate_log"

# Set to True to move duplicate files, False to only log them
# This is the main switch for running the script.
MOVE_DUPLICATES = False

# Port for the web server
PORT = 2226

# Files to exclude from the scan (e.g., the script files themselves)
EXCLUDED_FILES = {"web_interface.py", "utils.py", "config.py", "index.html"}