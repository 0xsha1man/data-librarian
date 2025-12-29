import { DataLibrarian as DLApiTypes } from '@/types/api';
import { DataLibrarian as DLTypes } from '@/types/library';
import { DataLibrarian as DLApi } from './api_server';
import { DataLibrarian as DLEnums } from './constants';

export namespace DataLibrarian {
    export namespace ApiClient {

        // Simple Validation Rule
        function isValidPath(path: string): boolean {
            // Prevent simple directory traversal attempts or illegal chars
            if (path.includes('..') || path.includes('~')) return false;
            return true;
        }

        export async function getStatus(moduleName: string, inputOptions: any = {}) {
            return DLApi.ApiServer.handleRequest({
                type: DLEnums.RequestType.GET,
                endpoint: DLEnums.Endpoints.STATUS,
                params: {
                    module: moduleName,
                    ...inputOptions
                }
            });
        }

        export async function startModule(moduleName: string, inputOptions: any = {}) {
            return DLApi.ApiServer.handleRequest({
                type: DLEnums.RequestType.POST,
                endpoint: DLEnums.Endpoints.ACTION,
                data: {
                    target: moduleName,
                    command: 'start',
                    inputs: inputOptions,
                    timestamp: Date.now()
                }
            });
        }

        /**
         * Fetch file list via POST.
         * Path is sent in BODY, not URL.
         */
        export async function getLibraryFiles(path: string = ""): Promise<DLApiTypes.ApiResponse<DLTypes.CatalogCard[]>> {

            if (!isValidPath(path)) {
                return { success: false, error: "Invalid Path Detected: '..' and '~' are not allowed." };
            }

            return DLApi.ApiServer.handleRequest<DLTypes.CatalogCard[]>({
                type: DLEnums.RequestType.POST,
                endpoint: DLEnums.Endpoints.LIBRARY,
                data: { path } // Path in Body
            });
        }
        export async function getConfig(): Promise<DLApiTypes.ApiResponse<any>> {
            // TODO: Ensure ApiServer points to new FastAPI port/paths
            return DLApi.ApiServer.handleRequest({
                type: DLEnums.RequestType.GET,
                endpoint: "/api/config" as any, // Cast if enum is strict
                data: {}
            });
        }

        export async function saveConfig(config: any): Promise<DLApiTypes.ApiResponse<any>> {
            return DLApi.ApiServer.handleRequest({
                type: DLEnums.RequestType.POST,
                endpoint: "/api/config" as any,
                data: config
            });
        }

        export async function getServerStatus(): Promise<DLApiTypes.ApiResponse<{ status: string, message: string, startup_time: number }>> {
            return DLApi.ApiServer.handleRequest({
                type: DLEnums.RequestType.GET,
                endpoint: "/" as any,
                data: {}
            });
        }
    }
}
