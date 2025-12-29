import { z } from "zod";

// --- Validation Schemas ---
export const ServerSchema = z.object({
    host: z.string().min(1, "Host is required"),
    port: z.coerce.number().min(1024).max(65535),
    root_path: z.string().min(1, "Root path is required"),
    scripts_dir: z.string().min(1),

    frontend_port: z.coerce.number().optional()
});

export const WeedingSchema = z.object({
    dry_run_mode: z.boolean(),
    log_path: z.string(),
    log_file_prefix: z.string(),
    holding_bin: z.string(),
    included_folders: z.any(), // Flexible for now (it's arrays)
    excluded_folders: z.any(),
    included_files: z.any(),
    excluded_files: z.any(),
    included_extensions: z.any(),
    excluded_extensions: z.any(),
});

export const SegmentingSchema = z.object({
    dry_run_mode: z.boolean(),
    log_path: z.string(),
    log_file_prefix: z.string(),
    max_mb: z.coerce.number().positive(),
    chunk_limit: z.coerce.number().positive(),
    included_folders: z.any(),
    excluded_folders: z.any(),
    included_files: z.any(),
    excluded_files: z.any(),
    included_extensions: z.any(),
    excluded_extensions: z.any(),
});

export const ConfigSchema = z.object({
    server: ServerSchema,
    weeding: WeedingSchema,
    segmenting: SegmentingSchema
});

export type ConfigType = z.infer<typeof ConfigSchema>;
