import rawConfig from '../config.json';

interface HostProps {
    host: string;
    port: number;
    root_path: string;
    scripts_dir: string;

}

interface BaseModuleProps {
    dry_run_mode: boolean;
    log_path: string;
    log_file_prefix: string;
}

interface FilterProps {
    included_folders: string[];
    excluded_folders: string[];
    included_files: string[];
    excluded_files: string[];
    included_extensions: string[];
    excluded_extensions: string[];
}

interface WeedingModuleProps {
    holding_bin: string;
}

interface SegmentingModuleProps {
    max_mb: number;
    chunk_limit: number;
}

export namespace DataLibrarian {
    export type ConfigType = {
        server: HostProps;
        weeding: BaseModuleProps & FilterProps & WeedingModuleProps;
        segmenting: BaseModuleProps & FilterProps & SegmentingModuleProps;
    };

    export const Config: ConfigType = rawConfig.data_librarian;
}
