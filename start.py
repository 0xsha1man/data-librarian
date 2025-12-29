import subprocess
import sys
import os
import time
import signal
import platform
import shutil
import socket
import json

# --- Configuration ---
def load_configuration():
    config_path = "config.json"
    if not os.path.exists(config_path):
        print(f"❌ Critical Error: {config_path} not found.")
        sys.exit(1)

    try:
        with open(config_path, "r") as f:
            data = json.load(f)
            
        dl = data.get("data_librarian", {})
        server = dl.get("server", {})
        
        # Backend Port
        backend_port = server.get("port", 2226)
        
        # Frontend Port - Add if missing
        if "frontend_port" not in server:
            print("⚙️ 'frontend_port' missing in config.json. Adding default (3000)...")
            server["frontend_port"] = 3000
            dl["server"] = server
            data["data_librarian"] = dl
            
            with open(config_path, "w") as f:
                json.dump(data, f, indent=4)
            frontend_port = 3000
        else:
            frontend_port = server["frontend_port"]
            
        return backend_port, frontend_port

    except Exception as e:
        print(f"❌ Critical Error loading config.json: {e}")
        sys.exit(1)

BACKEND_PORT, FRONTEND_PORT = load_configuration()
PYTHON_CMD = sys.executable

def install_dependencies():
    """Installs required Python packages."""
    print("📦 Checking Python dependencies...")
    try:
        subprocess.check_call([PYTHON_CMD, "-m", "pip", "install", "fastapi", "uvicorn", "pypdf", "--quiet"])
        print("✅ Dependencies installed.")
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies.")
        sys.exit(1)

def start_backend():
    """Starts the FastAPI backend."""
    print(f"🚀 Starting Backend on port {BACKEND_PORT}...")
    # Using 'python_core.main:app' assumes start.py is in the root directory
    return subprocess.Popen(
        [PYTHON_CMD, "-m", "uvicorn", "python_core.main:app", "--host", "0.0.0.0", "--port", str(BACKEND_PORT), "--reload"],
        cwd=os.getcwd()
    )

def start_frontend():
    """Starts the Next.js frontend."""
    print(f"🎨 Starting Frontend on port {FRONTEND_PORT}...")
    
    npm_cmd = "npm"
    if platform.system() == "Windows":
        npm_cmd = "npm.cmd"
    
    # Verify npm exists
    if not shutil.which(npm_cmd):
         print("❌ 'npm' not found in PATH. Please install Node.js.")
         sys.exit(1)

    return subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=os.getcwd(),
        # Pipe output if you want to silence it, or let it flow to valid stdout
    )

def get_local_ip():
    """Attempts to retrieve the local network IP address."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Prevent actual connection; just finds the interface used for routing
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip

def main():
    install_dependencies()
    
    backend_proc = start_backend()
    # Give backend a moment to initialize
    time.sleep(2)
    
    frontend_proc = start_frontend()
    time.sleep(2)
    
    local_ip = get_local_ip()
    target_host = local_ip if local_ip != "127.0.0.1" else "localhost"
    
    print("\n✨ Data Librarian Stack is RUNNING! ✨")
    print(f"👉 Dashboard: http://{target_host}:{FRONTEND_PORT}")
    print(f"   (Backend API active on port {BACKEND_PORT})")
    print("\n(Press Ctrl+C to stop)\n")

    try:
        while True:
            time.sleep(1)
            # Check if processes are dead
            if backend_proc.poll() is not None:
                print("❌ Backend process died unexpectedly.")
                break
            if frontend_proc.poll() is not None:
                print("❌ Frontend process died unexpectedly.")
                break
    except KeyboardInterrupt:
        print("\n🛑 Stopping services...")
    finally:
        if backend_proc.poll() is None:
            backend_proc.terminate()
        if frontend_proc.poll() is None:
            frontend_proc.terminate()
        print("👋 Goodbye!")

if __name__ == "__main__":
    main()
