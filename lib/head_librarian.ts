import { DataLibrarian as DLApiTypes } from '@/types/api';
import { DataLibrarian as Types } from '@/types/library';
import { DataLibrarian as Client } from './api_client';

export namespace DataLibrarian {
    export class HeadLibrarian {

        private static CACHE_PREFIX = 'catalog_';
        private static CONFIG_CACHE_KEY = 'sys_config';
        private static SERVER_ID_KEY = 'sys_server_id';

        /**
         * Checks if the server has restarted since last visit.
         * If so, flushes the configuration cache to ensure freshness.
         */
        static async verifyServerIdentity() {
            const response = await Client.ApiClient.getServerStatus();
            if (response.success && response.data && response.data.startup_time) {
                const lastId = localStorage.getItem(this.SERVER_ID_KEY);
                const currentId = response.data.startup_time.toString();

                if (lastId !== currentId) {
                    console.log('[HeadLibrarian] Server restart detected. Flushing Config Cache.');
                    this.flushConfig();
                    // Optionally flush catalog too if desired? User asked for "refresh the cache for the config"
                    // this.flushCatalog(); 
                    localStorage.setItem(this.SERVER_ID_KEY, currentId);
                }
            }
        }

        /**
         * The Main Interface.
         * UI calls this. Logic flows: Cache -> API -> Update Cache.
         * Guaranteed to return an ApiResponse (success: true/false). Never throws.
         */
        static async getCatalog(path: string, forceRefresh = false): Promise<DLApiTypes.ApiResponse<Types.CatalogCard[]>> {
            const cacheKey = `${this.CACHE_PREFIX}${path}`;

            // 1. Check Cache
            if (!forceRefresh) {
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    try {
                        // Validate and Parse
                        const data = JSON.parse(cached);
                        // TODO: Add TTL check here if needed in future
                        return { success: true, data };
                    } catch (e) {
                        console.warn('[HeadLibrarian] Cache corrupt, purging:', cacheKey);
                        localStorage.removeItem(cacheKey);
                    }
                }
            }

            // 2. Cache Miss or Force Refresh? -> Ask Jr Librarian
            const response = await Client.ApiClient.getLibraryFiles(path);

            // 3. Update Cache on Success
            if (response.success && response.data) {
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(response.data));
                } catch (e) {
                    console.error('[HeadLibrarian] Storage Quota Exceeded or Error:', e);
                    // We still return the data, even if caching failed
                }
                return response;
            }

            // 4. Return Failure (pass through error)
            return response || { success: false, error: "Unknown error retrieving catalog" };
        }

        /**
         * Get Configuration (Cached)
         */
        static async getConfig(forceRefresh = false): Promise<DLApiTypes.ApiResponse<any>> {
            // 1. Check Cache
            if (!forceRefresh) {
                const cached = typeof window !== 'undefined' ? localStorage.getItem(this.CONFIG_CACHE_KEY) : null;
                if (cached) {
                    try {
                        const data = JSON.parse(cached);
                        // Validate structure (Auto-heal corrupt cache)
                        if (data && data.server) {
                            return { success: true, data };
                        } else {
                            console.warn('[HeadLibrarian] Cached config invalid (missing server), flushing.');
                            localStorage.removeItem(this.CONFIG_CACHE_KEY);
                        }
                    } catch (e) {
                        localStorage.removeItem(this.CONFIG_CACHE_KEY);
                    }
                }
            }

            // 2. Fetch
            const response = await Client.ApiClient.getConfig();

            // 3. Update Cache
            if (response.success && response.data) {
                localStorage.setItem(this.CONFIG_CACHE_KEY, JSON.stringify(response.data));
            }

            return response;
        }

        /**
         * Save Configuration & Update Cache
         */
        static async saveConfig(config: any): Promise<DLApiTypes.ApiResponse<any>> {
            const response = await Client.ApiClient.saveConfig(config);

            if (response.success) {
                // Determine what to cache: the returned data (if backend returns full config) or the submitted config
                // Backend returns {success: true, message: "...", data: {...actual_config...}}
                // We need to ensure we cache ONLY the actual config object.
                let dataToCache = response.data;
                if (dataToCache && dataToCache.data) {
                    dataToCache = dataToCache.data;
                }
                localStorage.setItem(this.CONFIG_CACHE_KEY, JSON.stringify(dataToCache || config));
            }

            return response;
        }

        /**
         * Clear the entire card catalog cache.
         * Useful for a "Hard Reload" button.
         */
        static flushCatalog() {
            // Clear only keys starting with catalog_
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.CACHE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        }

        /**
         * Clear the configuration cache.
         */
        static flushConfig() {
            localStorage.removeItem(this.CONFIG_CACHE_KEY);
        }
    }
}
