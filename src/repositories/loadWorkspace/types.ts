export interface WorkspaceFiles {
  readonly config: string;
  readonly collections: readonly string[];
  readonly servers: readonly string[];
}

export interface ScanWorkspaceResult {
  timestamps: Timestamps;
  files: WorkspaceFiles;
}

export interface Timestamps {
  config: number;
  collections: Record<string, number>;
  servers: Record<string, number>;
}
