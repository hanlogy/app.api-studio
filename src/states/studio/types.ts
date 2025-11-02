import type {
  WORKSPACE_CONFIG_FILE,
  Workspace,
  WorkspaceSummary,
} from '@/definitions';

export interface WorkspaceFiles {
  readonly config: typeof WORKSPACE_CONFIG_FILE;
  readonly apis: string[];
}

/**
 * - `initializing`: reading from cache
 * - `waiting`: no workspace opened
 * - `loading`: when reading and parsing workspace files (initial,
 *   background refresh, or workspace switched).
 * - `ready`: when data is ready and no file operations are in progress.
 */
export type StudioStateStatus =
  | 'initializing'
  | 'waiting'
  | 'loading'
  | 'ready';

export type StudioState =
  | {
      readonly status: 'initializing';
    }
  | {
      readonly status: 'waiting';
      readonly workspaces: readonly WorkspaceSummary[];
    }
  | {
      readonly status: 'loading';
      readonly workspaces: readonly WorkspaceSummary[];
      readonly workspace?: Workspace;
    }
  | {
      readonly status: 'ready';
      readonly workspaces: readonly WorkspaceSummary[];
      readonly workspace: Workspace;
    };

export interface StudioStateCache {
  readonly workspaces: readonly WorkspaceSummary[];
}

export interface StudioContextValue {
  readonly state: StudioState;
  readonly openWorkspace: (path: string) => void;
}
