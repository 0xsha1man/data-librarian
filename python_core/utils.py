"""
Utility functions for The Data Librarian, including
file sanitization, hashing, and logging.
Author: Jesse Tudela
"""

import os
import hashlib
import re
import codecs
import sys
import io
from typing import TextIO, Optional

def sanitize_filename(filename: str) -> str:
    """
    Sanitizes a filename by removing extra spaces and hyphens, trimming whitespace,
    and removing invalid Windows filename characters. Preserves Unicode.

    Args:
        filename (str): The original filename.

    Returns:
        str: The sanitized filename.
    """
    if not isinstance(filename, str):
        raise TypeError("filename must be a string")

    # Remove leading/trailing whitespace
    sanitized = filename.strip()

    # Replace multiple spaces with a single space
    sanitized = re.sub(r" +", " ", sanitized)

    # Replace multiple hyphens with a single hyphen
    sanitized = re.sub(r"--+", "-", sanitized)

    # Remove characters that are invalid in Windows filenames
    # These include: < > : " / \ | ? * and control characters (ASCII 0-31)
    sanitized = re.sub(r'[<>:"/\\|?*\x00-\x1F]', "", sanitized)
    
    # Ensure the filename is not just whitespace or empty
    if not sanitized.strip():
        sanitized = "unnamed_file"

    return sanitized


def calculate_sha256(filepath: str) -> Optional[str]:
    """
    Calculates the SHA256 hash of a file.

    Args:
        filepath (str): The path to the file.

    Returns:
        Optional[str]: The SHA256 hash of the file, or None on error.
    """
    if not isinstance(filepath, str):
        print(f"*** ERROR: Invalid filepath type: {type(filepath)}", file=sys.stderr)
        return None
    
    if not os.path.isfile(filepath):
        # Don't print an error here, just return None. This could be a temp file.
        return None

    sha256_hash = hashlib.sha256()
    try:
        with open(filepath, "rb") as f:
            # Read in chunks for large files
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    except (IOError, OSError) as e:
        # Print error to stderr for immediate visibility in console
        # This will also be caught by the web_interface.py and sent to the output buffer
        sys.stderr.write(f"*** ERROR reading file: {filepath!r} - {e!r}\n")
        print(f"*** ERROR reading file: {filepath!r} - {e!r}\n", end="")
        return None


def log_message(log_file: TextIO, message: str) -> None:
    """
    Writes a message to the log file and prints it to the console.
    Handles potential Unicode encoding errors during writing.

    Args:
        log_file (TextIO): The open log file object (opened with UTF-8).
        message (str): The message to log.
    """
    if not isinstance(log_file, (codecs.StreamReaderWriter, io.TextIOWrapper)):
        # Check if it's a file-like object (like stdout/stderr)
        if hasattr(log_file, 'write'):
             pass # Assume it's a valid file-like object
        else:
             print(f"*** CRITICAL log_message error: log_file is not a valid file object. Type: {type(log_file)}", file=sys.stderr)
             return
             
    if not isinstance(message, str):
        message = str(message) # Attempt to convert non-strings

    try:
        log_file.write(message)
        log_file.flush() # Ensure it gets written immediately
        print(message, end="") # Print to console 
    except (IOError, OSError, UnicodeEncodeError) as e:
        error_msg = f"*** CRITICAL log_message ERROR: {e!r}\n"
        sys.stderr.write(error_msg)
        print(error_msg, end="")