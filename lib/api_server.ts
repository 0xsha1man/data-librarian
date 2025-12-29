import { DataLibrarian as DLTypes } from '@/types/api';
import { DataLibrarian as DLConfig } from '@/types/config';
import { DataLibrarian as DLEnums } from './constants';

export namespace DataLibrarian {
    export namespace ApiServer {

        export interface RequestPacket {
            type: DLEnums.RequestType;
            endpoint: string;
            params?: Record<string, any>;
            data?: any;
        }

        // Helper: Build URL using Config
        function buildUrl(endpoint: string, params?: Record<string, any>): string {
            // 1. Get Data from Config (Aliased)
            const { server } = DLConfig.Config;

            // 2. Protocol-Relative Base
            // Use window.location.hostname if available to support network access
            const host = typeof window !== 'undefined' ? window.location.hostname : server.host;
            const baseUrl = `http://${host}:${server.port}`;

            const url = new URL(endpoint, baseUrl);

            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    url.searchParams.append(key, String(value));
                });
            }
            return url.toString();
        }

        function buildOptions(type: DLEnums.RequestType, data?: any): RequestInit {
            const options: RequestInit = { method: type, headers: {} };
            if (type === DLEnums.RequestType.POST && data) {
                options.headers = { 'Content-Type': 'application/json' };
                options.body = JSON.stringify(data);
            }
            return options;
        }

        /**
         * Executed Network Request.
         * Returns a standardized ApiResponse. NEVER THROWS.
         */
        export async function handleRequest<T>(packet: RequestPacket): Promise<DLTypes.ApiResponse<T>> {
            try {
                const url = buildUrl(packet.endpoint, packet.params);
                const options = buildOptions(packet.type, packet.data);

                const res = await fetch(url, options);

                if (!res.ok) {
                    return {
                        success: false,
                        error: `HTTP Error ${res.status}: ${res.statusText}`
                    };
                }

                // Parse JSON
                const json = await res.json();
                return { success: true, data: json };

            } catch (e: any) {
                console.error('[ApiServer] Request Failed:', e);
                return {
                    success: false,
                    error: e.message || 'Network Request Failed'
                };
            }
        }
    }
}
