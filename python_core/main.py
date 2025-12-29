import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from python_core.serverconfig import ServerConfig

app = FastAPI(title="Data Librarian API")
STARTUP_TIME = int(time.time())

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev convenience, or specify ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online", 
        "message": "Data Librarian API is running",
        "startup_time": STARTUP_TIME
    }

# Returns the full configuration object.
@app.get("/api/config")
def get_config():
    cfg = ServerConfig()
    # We return the root 'data_librarian' object so the frontend gets {server:..., weeding:..., etc}
    return cfg.get_root()

# Updates configuration settings.
# Expects a partial or full config object structured like:
# {
#     "server": { ... },
#     "weeding": { ... },
#     "segmenting": { ... }
# }
@app.post("/api/config")
def update_config(config: dict):
    cfg = ServerConfig()
    
    # Iterate over top-level keys (modules or server)
    for section_name, section_data in config.items():
        if not isinstance(section_data, dict):
            continue
            
        if section_name == "server":
            # Update server settings
            for key, value in section_data.items():
                cfg.update_server_setting(key, value)
        else:
            # Update module settings (weeding, segmenting, etc)
            for key, value in section_data.items():
                cfg.update_module_setting(section_name, key, value)
                
    return {"success": True, "message": "Configuration updated", "data": cfg.get_root()}
