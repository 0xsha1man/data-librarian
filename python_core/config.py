"""
Configuration settings for The Data Librarian.
Author: Jesse Tudela
"""

import json
import os

"""
Configuration Manager for The Data Librarian.
Loads settings
"""
# Module Constants
MODULE_WEEDING = "weeding"
MODULE_SEGMENTATION = "segmentation"

# Check if config.json exists, if not create it with defaults
config_path = 'config.json'

CONFIG_FILE = "config.json"

# Internal system excludes (always active)
SYSTEM_EXCLUDED_FILES = {
    "web_interface.py", 
    "utils.py", 
    "config.py", 
    "index.html", 
    "dashboard.html", 
    "config.json"
}

# Defaults used if config.json is missing or incomplete
DEFAULTS = {
    "EXCLUDED_FOLDERS": ["_DuplicateHoldingBin"],
    "DUPLICATE_HOLDING_DIR": "./_DuplicateHoldingBin",
    "LOG_NAME_PREFIX": "_duplicate_log",
    "MOVE_DUPLICATES": False,
    "PORT": 2226,
    "USER_EXCLUDED_FILES": [],
    "PDF_TARGET_CHUNK_MB": 100,
    "PDF_PAGE_CHUNK_LIMIT": 1000
}

# Module-level variables to be exported
# We map the JSON keys to Python variables for usage
locals().update(DEFAULTS)
# EXCLUDED_FILES is a derived property
EXCLUDED_FILES = list(SYSTEM_EXCLUDED_FILES)

def load_config():
    """
    Loads configuration from JSON file and updates module globals.
    """
    global EXCLUDED_FOLDERS, DUPLICATE_HOLDING_DIR, LOG_NAME_PREFIX, MOVE_DUPLICATES, PORT
    global USER_EXCLUDED_FILES, EXCLUDED_FILES
    global PDF_TARGET_CHUNK_MB, PDF_PAGE_CHUNK_LIMIT

    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r') as f:
                data = json.load(f)
                
            # Update globals with loaded data, falling back to defaults
            EXCLUDED_FOLDERS = data.get("EXCLUDED_FOLDERS", DEFAULTS["EXCLUDED_FOLDERS"])
            DUPLICATE_HOLDING_DIR = data.get("DUPLICATE_HOLDING_DIR", DEFAULTS["DUPLICATE_HOLDING_DIR"])
            LOG_NAME_PREFIX = data.get("LOG_NAME_PREFIX", DEFAULTS["LOG_NAME_PREFIX"])
            MOVE_DUPLICATES = data.get("MOVE_DUPLICATES", DEFAULTS["MOVE_DUPLICATES"])
            PORT = data.get("PORT", DEFAULTS["PORT"])
            USER_EXCLUDED_FILES = data.get("USER_EXCLUDED_FILES", DEFAULTS["USER_EXCLUDED_FILES"])
            
            PDF_TARGET_CHUNK_MB = data.get("PDF_TARGET_CHUNK_MB", DEFAULTS["PDF_TARGET_CHUNK_MB"])
            PDF_PAGE_CHUNK_LIMIT = data.get("PDF_PAGE_CHUNK_LIMIT", DEFAULTS["PDF_PAGE_CHUNK_LIMIT"])
            
            # Combine System and User excludes
            EXCLUDED_FILES = list(SYSTEM_EXCLUDED_FILES.union(set(USER_EXCLUDED_FILES)))
            
            print(f"Configuration loaded from {CONFIG_FILE}")
        except Exception as e:
            print(f"Error loading config.json: {e}. Using defaults.")
    else:
        print(f"{CONFIG_FILE} not found. Using defaults.")
        # Setup derived defaults
        EXCLUDED_FILES = list(SYSTEM_EXCLUDED_FILES)

def save_config(new_config):
    """
    Updates config.json with new values.
    Args:
        new_config (dict): Dictionary of settings to update.
    """
    current_data = DEFAULTS.copy()
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r') as f:
                current_data.update(json.load(f))
        except:
            pass
            
    current_data.update(new_config)
    
    # Ensure generated keys are not saved if they crept in?
    # No, new_config comes from the UI which should map clearly.

    try:
        with open(CONFIG_FILE, 'w') as f:
            json.dump(current_data, f, indent=4)
        
        load_config()
        return True
    except Exception as e:
        print(f"Error saving config: {e}")
        return False

# Load on import
load_config()