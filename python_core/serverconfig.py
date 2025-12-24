import json
import os
import threading

# Manages the data-librarian configuration.
# Implements a 'Read-on-Demand' pattern where settings are always
# retrieved from the current memory state, which stays synced with the file.
class ServerConfig:
    
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, config_path="config.json"):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(ServerConfig, cls).__new__(cls)
                    cls._instance._initialized = False
                    
        return cls._instance

    def __init__(self, config_path="config.json"):
        # Singleton init check
        if self._initialized:
            return
            
        self.config_path = os.path.abspath(config_path)
        print(f"[ServerConfig.__init__] Initializing with path: {self.config_path}")
        self.data = {}
        self.load()
        self._initialized = True

    # Loads the configuration from the JSON file.
    # If file doesn't exist, raises FileNotFoundError (or could init defaults).
    def load(self):
        if not os.path.exists(self.config_path):
             print(f"[ServerConfig.load] Warning: Config file not found at {self.config_path}")
             return

        print(f"[ServerConfig.load] Loading configuration from {self.config_path}")
        with self._lock:
            try:
                with open(self.config_path, 'r') as f:
                    self.data = json.load(f)

                print(f"[ServerConfig.load] Successfully loaded configuration.")
            except Exception as e:
                print(f"[ServerConfig.load] Message: {e}")

    # Writes the current memory state to the JSON file.
    def save(self):
        print(f"[ServerConfig.save] Saving configuration to {self.config_path}")

        with self._lock:
            try:
                with open(self.config_path, 'w') as f:
                    json.dump(self.data, f, indent=4)

                print(f"[ServerConfig.save] Successfully saved configuration.")
            except Exception as e:
                print(f"[ServerConfig.save] Message: {e}")

    # Returns the 'data_librarian' root object
    def get_root(self):
        return self.data.get("data_librarian", {})

    def get_server_config(self):
        return self.get_root().get("server", {})

    # Retrieves the configuration for a specific module.
    # args:
    #     module_name (str): e.g., 'weeding', 'segmenting'
    def get_module_config(self, module_name):
        modules = self.get_root().get("modules", {})
        return modules.get(module_name, {})

    # Updates a setting for a specific module and saves to disk.
    def update_module_setting(self, module_name, key, value):
        print(f"[ServerConfig.update_module_setting] Updating {module_name}.{key} = {value}")

        with self._lock:
            root = self.data.get("data_librarian", {})
            modules = root.get("modules", {})

            if module_name in modules:
                modules[module_name][key] = value
                # Ensure structure integrity
                root["modules"] = modules
                self.data["data_librarian"] = root
                self.save()
                return True

            print(f"[ServerConfig.update_module_setting] Module '{module_name}' not found.")
            return False

    def update_server_setting(self, key, value):
        print(f"[ServerConfig.update_server_setting] Updating server.{key} = {value}")

        with self._lock:
            root = self.data.get("data_librarian", {})
            server = root.get("server", {})
            server[key] = value

            # Ensure structure integrity
            root["server"] = server
            self.data["data_librarian"] = root
            self.save()
