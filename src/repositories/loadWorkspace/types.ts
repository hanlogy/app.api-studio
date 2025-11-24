export interface WorkspaceFiles {
  readonly config: string;
  readonly collections: readonly string[];
}

export interface ScanWorkspaceResult {
  timestamps: Timestamps;
  files: {
    config: 'config.json';
    collections: string[];
  };
}

export interface Timestamps {
  config: number;
  collections: Record<string, number>;
}
