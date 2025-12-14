"""
Web Interface for The Data Librarian - Duplicate File Cleaner
Author: Jesse Tudela
"""

import http.server
import socketserver
import subprocess
import shutil
import threading
import time
import os
import json
import codecs
import io
import sys
import signal
from urllib.parse import urlparse
from datetime import datetime

# Import from local modules
try:
    from config import EXCLUDED_FOLDERS, DEFAULT_HOLDING_DIR, DEFAULT_LOG_FILE, MOVE_DUPLICATES, PORT, EXCLUDED_FILES, PDF_MAX_SIZE_MB, PDF_TARGET_CHUNK_MB, PDF_PAGE_CHUNK_LIMIT
    from utils import sanitize_filename, calculate_sha256, log_message
    from pypdf import PdfReader, PdfWriter
except ImportError:
    print("Error: 'config.py', 'utils.py', or 'pypdf' not found. Please make sure they are in the same directory and pypdf is installed.")
    sys.exit(1)


# --- Global State Variables ---
output_buffer = []
script_running = False
script_process = None
keep_running = True
total_files = 0
files_checked = 0
log_file_path = ""
# Use os.path.abspath to get a clean, absolute path
root_directory = os.path.abspath(".") 

# --- PDF Global Variables ---
pdf_script_running = False
pdf_keep_running = True
pdf_output_buffer = []
# ------------------------------


def run_script():
    """
    Runs the duplicate file cleaning script as a separate process
    and captures its output.
    """
    global script_running, output_buffer, files_checked, total_files, script_process, keep_running, log_file_path, root_directory

    # --- Reset state for a new run ---
    script_running = True
    output_buffer = []  # Clear previous output
    files_checked = 0  # Reset file counter
    total_files = 0
    keep_running = True
    
    start_time = datetime.now()
    # Format timestamp for filenames (no colons or other invalid chars)
    timestamp = start_time.strftime("%m-%d-%Y_%H-%M-%S")
    log_file_name = f"{os.path.splitext(DEFAULT_LOG_FILE)[0]}_{timestamp}.txt"
    
    # Create holding dir if it doesn't exist, as it's needed for the log
    if not os.path.exists(DEFAULT_HOLDING_DIR):
        try:
            os.makedirs(DEFAULT_HOLDING_DIR)
        except OSError as e:
            output_buffer.append(f"*** CRITICAL ERROR: Could not create holding directory '{DEFAULT_HOLDING_DIR}': {e!r}\n")
            script_running = False
            return

    log_path = os.path.join(DEFAULT_HOLDING_DIR, log_file_name)
    log_file_path = os.path.abspath(log_path) # Update global for web UI

    file_hashes = {}
    files_moved = 0
    log = None

    try:
        log = codecs.open(log_path, "w", encoding="utf-8")
        
        log_message(log, f"DUPLICATE FILE DETECTION STARTED AT: [{start_time.isoformat()}]\n")
        log_message(log, "----------------------------------------------------------------------------------------------------\n\n")

        # --- First Pass: Count files (for progress bar) ---
        log_message(log, "Calculating total files...\n")
        temp_total = 0
        for root, dirs, files in os.walk(root_directory):
            # Ensure we respect excluded folders during count
            dirs[:] = [d for d in dirs if d not in EXCLUDED_FOLDERS]
            
            # Exclude script/config files
            current_files = [f for f in files if f not in EXCLUDED_FILES]
            temp_total += len(current_files)
        
        total_files = temp_total # Assign to global
        log_message(log, f"Total files to scan: {total_files}\n")
        
        # --- Second Pass: Process files ---
        files_processed = 0 # Use a local counter for the final tally
        for root, dirs, files in os.walk(root_directory):
            if not keep_running:
                log_message(log, "\n*** USER CANCELLATION DETECTED ***\n")
                break
                
            dirs[:] = [d for d in dirs if d not in EXCLUDED_FOLDERS]

            for filename in files:
                if not keep_running:
                    break

                # Exclude self and helper files
                if filename in EXCLUDED_FILES:
                    continue

                filepath = os.path.join(root, filename)
                files_checked += 1 # Update global counter for UI
                files_processed += 1 # Update local counter for final log
                
                try:
                    file_hash = calculate_sha256(filepath)
                    if file_hash is None:
                        # Error already logged by calculate_sha256
                        continue

                    if file_hash in file_hashes:
                        original_filepath = file_hashes[file_hash]
                        original_filename = os.path.basename(original_filepath)
                        duplicate_filename = os.path.basename(filepath)
                        sanitized_filename = sanitize_filename(duplicate_filename) # Use the imported config variable
                        sanitized_dest_path = os.path.join(DEFAULT_HOLDING_DIR, sanitized_filename)

                        log_message(
                            log,
                            f"Duplicate found:\n  Original: [{original_filename!r}]\n  Duplicate: [{duplicate_filename!r}]\n  Moved as: [{sanitized_filename!r}]\n\n",
                        )
                        
                        if MOVE_DUPLICATES:
                            # log_message(log, f"Attempting to move: {duplicate_filename!r} to {sanitized_dest_path!r}\n")
                            try:
                                if os.path.exists(filepath): # Check if file still exists
                                    shutil.move(filepath, sanitized_dest_path)
                                    files_moved += 1
                                    # log_message(log, f"Successfully moved: {duplicate_filename!r} to {sanitized_dest_path!r}\n")
                                else:
                                    log_message(log, f"*** WARNING: File vanished before move: {filepath!r}\n\n")
                            except (OSError, IOError) as e:
                                log_message(
                                    log,
                                    f"*** ERROR moving file: {duplicate_filename!r} to {sanitized_dest_path!r} - {e!r}\n\n{e!r}\n",
                                )
                    else:
                        file_hashes[file_hash] = filepath
                        
                except Exception as e:
                    # Catch potential errors like FileNotFoundError if a file is deleted during scan
                    log_message(log, f"*** ERROR processing file [{filepath!r}]: {e!r}\n\n")

        end_time = datetime.now()
        duration = end_time - start_time
        log_message(
            log,
            f"\n\n----------------------------------------------------------------------------------------------------\n"
            f"DUPLICATE FILE DETECTION FINISHED AT: [{end_time.isoformat()}]\n"
            f"Total Time Taken: [{duration}]\n"
            f"Total Files Processed: [{files_processed}]\n"
            f"Total Files Moved: [{files_moved}]\n",
        )

    except (OSError, IOError) as e:
        error_msg = f"*** CRITICAL ERROR: Failed to open or write to log file: {log_path!r} - {e!r}\n"
        sys.stderr.write(error_msg)
        output_buffer.append(error_msg) # Try to send to UI
    except Exception as e:
        error_msg = f"*** UNEXPECTED ERROR in run_script: {e!r}\n"
        sys.stderr.write(error_msg)
        output_buffer.append(error_msg)
        if log:
            log_message(log, error_msg)
    finally:
        if log:
            log.close()
        script_running = False
        script_process = None # Clear process object

def split_pdf_adaptive(file_path, target_max_mb, initial_page_chunk, log):
    """
    Splits a PDF into chunks. If a chunk exceeds target_max_mb, it retries with smaller page counts.
    """
    try:
        reader = PdfReader(file_path)
        total_pages = len(reader.pages)
        base_name = os.path.splitext(file_path)[0]
        
        current_page_chunk = initial_page_chunk
        start_page = 0
        
        while start_page < total_pages:
            if not pdf_keep_running:
                 return

            # Try to create a chunk
            temp_files_created = []
            success = False
            
            while not success:
                if not pdf_keep_running:
                     return

                end_page = min(start_page + current_page_chunk, total_pages)
                writer = PdfWriter()
                
                for i in range(start_page, end_page):
                    writer.add_page(reader.pages[i])
                
                part_num = (start_page // initial_page_chunk) + 1 # This logic might drift with adaptive sizing, but unique naming is key
                # Use a specific naming convention to avoid collisions if we drift
                output_filename = f"{base_name}_part_{start_page + 1}-{end_page}.pdf"
                
                try:
                    with open(output_filename, "wb") as out_file:
                        writer.write(out_file)
                    temp_files_created.append(output_filename)
                    
                    # Check size
                    file_size_mb = os.path.getsize(output_filename) / (1024 * 1024)
                    
                    if file_size_mb > target_max_mb:
                        log_message(log, f"   > Chunk {output_filename} is {file_size_mb:.2f}MB (Max: {target_max_mb}MB). Too big.\n")
                        # Delete the file
                        os.remove(output_filename)
                        temp_files_created.remove(output_filename)
                        
                        # Calculate new safer chunk size
                        ratio = target_max_mb / file_size_mb
                        current_page_chunk = int(current_page_chunk * ratio * 0.9) # 90% compliance factor
                        if current_page_chunk < 1:
                            current_page_chunk = 1 # Minimum 1 page
                        
                        log_message(log, f"   > Retrying with {current_page_chunk} pages...\n")
                    else:
                        success = True
                        log_message(log, f"   > Created: {os.path.basename(output_filename)} ({file_size_mb:.2f}MB)\n")
                        start_page = end_page
                        # Reset chunk size to initial for next batch? Or keep adaptive? 
                        # Let's keep adaptive for this file as pages are likely similar density
                        
                except Exception as e:
                    log_message(log, f"*** ERROR writing chunk: {e}\n")
                    return

    except Exception as e:
        log_message(log, f"*** ERROR processing PDF {file_path}: {e}\n")


def run_pdf_script(target_folder, max_mb, initial_pages):
    global pdf_script_running, pdf_output_buffer, pdf_keep_running
    
    pdf_script_running = True
    pdf_output_buffer = []
    pdf_keep_running = True
    
    start_time = datetime.now()
    log = io.StringIO() # Buffer log for now, or could write to file. User didn't request a persistent log file like duplicates.
    # Let's wrap log to point to our buffer helper
    # Actually, let's just make a simple wrapper class or use a list
    
    # We will just append to pdf_output_buffer directly for simplicity in this thread
    def log_to_buffer(msg):
        pdf_output_buffer.append(msg)
        print(msg, end="")

    try:
        log_to_buffer(f"PDF SPLITTER STARTED AT: [{start_time.isoformat()}]\n")
        log_to_buffer(f"Target Folder: {target_folder}\n")
        log_to_buffer(f"Max File Size: {max_mb} MB\n")
        log_to_buffer(f"Initial Page Split: {initial_pages}\n")
        log_to_buffer("-" * 60 + "\n")

        if not os.path.exists(target_folder):
            log_to_buffer(f"*** ERROR: Folder not found: {target_folder}\n")
            return

        pdf_files_found = 0
        
        for root, dirs, files in os.walk(target_folder):
            if not pdf_keep_running:
                break
            
            for file in files:
                if not pdf_keep_running:
                    break
                    
                if file.lower().endswith('.pdf'):
                    # Skip files that look like parts we created to avoid loops if scanning same dir
                    if "_part_" in file:
                         continue
                         
                    file_path = os.path.join(root, file)
                    try:
                        size_mb = os.path.getsize(file_path) / (1024 * 1024)
                        
                        if size_mb > PDF_MAX_SIZE_MB: # Trigger threshold
                            pdf_files_found += 1
                            log_to_buffer(f"Processing: {file} ({size_mb:.2f} MB)...\n")
                            
                            # Log object for helper function
                            # We can pass a dummy object that has a .write method that calls log_to_buffer
                            class LogWrapper:
                                def write(self, msg):
                                    log_to_buffer(msg)
                                def flush(self):
                                    pass
                            
                            split_pdf_adaptive(file_path, max_mb, initial_pages, LogWrapper())
                            log_to_buffer(f"Done with {file}\n\n")
                            
                    except OSError as e:
                        log_to_buffer(f"*** ERROR accessing {file}: {e}\n")

        end_time = datetime.now()
        duration = end_time - start_time
        log_to_buffer("-" * 60 + "\n")
        log_to_buffer(f"FINISHED. Processed {pdf_files_found} large PDF(s).\n")
        log_to_buffer(f"Total Time: {duration}\n")

    except Exception as e:
        log_to_buffer(f"*** CRITICAL ERROR: {e}\n")
    finally:
        pdf_script_running = False

class MyHandler(http.server.SimpleHTTPRequestHandler):
    """
    Custom HTTP request handler for the web interface.
    """

    def do_GET(self):
        """
        Handles GET requests.
        """
        url_path = urlparse(self.path).path

        if url_path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            try:
                with codecs.open('index.html', 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Inject dynamic values
                    content = content.replace("{rootfolder}", root_directory)
                    content = content.replace("{log_file_path}", log_file_path)
                    content = content.replace("{output}", "".join(output_buffer)) # Send current buffer on load
                    self.wfile.write(content.encode('utf-8'))
            except FileNotFoundError:
                self.send_error(404, "File not found: index.html")
            return

        elif url_path == '/get_output':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            # Send current buffer contents and clear it
            output_data = {'output': output_buffer, 'files_checked': files_checked, 'total_files': total_files}
            globals()['output_buffer'] = []
            self.wfile.write(json.dumps(output_data).encode('utf-8'))
            return

        elif url_path == '/check_status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'running': script_running, 'log_file_path': log_file_path}).encode('utf-8'))
            return

        elif url_path == '/run_script':
            if script_running:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'running'}).encode('utf-8'))
                return
            
            # Start the script in a new thread
            thread = threading.Thread(target=run_script)
            thread.daemon = True
            thread.start()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'started', 'log_file_path': log_file_path}).encode('utf-8'))
            return

            return
            
        elif url_path == '/run_pdf_splitter':
            if pdf_script_running:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'running'}).encode('utf-8'))
                return

            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            data = json.loads(post_body)
            
            target_folder = data.get('target_folder', root_directory)
            try:
                max_mb = float(data.get('max_size_mb', PDF_TARGET_CHUNK_MB))
            except:
                max_mb = PDF_TARGET_CHUNK_MB
                
            try:
                initial_pages = int(data.get('initial_page_count', PDF_PAGE_CHUNK_LIMIT))
            except:
                initial_pages = PDF_PAGE_CHUNK_LIMIT

            # Start thread
            thread = threading.Thread(target=run_pdf_script, args=(target_folder, max_mb, initial_pages))
            thread.daemon = True
            thread.start()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'started'}).encode('utf-8'))
            return

        elif url_path == '/get_pdf_output':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            output_data = {'output': pdf_output_buffer}
            globals()['pdf_output_buffer'] = [] # Clear buffer
            self.wfile.write(json.dumps(output_data).encode('utf-8'))
            return

        elif url_path == '/check_pdf_status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'running': pdf_script_running}).encode('utf-8'))
            return

        elif url_path == '/cancel_script':
            if script_running:
                print("Attempting to terminate script...")
                globals()['keep_running'] = False  # Signal the loop to stop
                # The script will stop on its own, no need to kill a process
                globals()['output_buffer'].append("\n*** SCRIPT CANCELLED BY USER ***\n")

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'cancelled'}).encode('utf-8'))
            else:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'not_running'}).encode('utf-8'))
            return
            
        else:
            # Handle 404 for favicon.ico and other unhandled requests quietly
            if url_path.endswith('favicon.ico'):
                self.send_response(404)
                self.end_headers()
            else:
                super().do_GET()  # Serve other files if present (e.g., if you add CSS/JS files)


def start_server(port=PORT):
    """
    Starts the HTTP server.
    """
    try:
        httpd = socketserver.TCPServer(("", port), MyHandler)
        print(f"Serving at http://localhost:{port}")
        httpd.serve_forever()
    except OSError as e:
        print(f"*** ERROR: Could not start server on port {port}. {e}")
        print("Please check if the port is already in use.")
        sys.exit(1)


if __name__ == "__main__":
    # Start the server in a separate thread.
    server_thread = threading.Thread(target=start_server)
    server_thread.daemon = True  # So the server shuts down when the main thread does.
    server_thread.start()


    # Keep the main thread alive, or the server will exit.
    # This also allows handling KeyboardInterrupt (Ctrl+C) gracefully.
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down server...")
        # Attempt to stop the script process if it's running
        if script_running:
            print("Stopping running script...")
            keep_running = False
            time.sleep(1) # Give the script a moment to see the flag
        sys.exit(0)