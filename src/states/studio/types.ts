import type {Workspace, WorkspaceSummary} from '@/definitions';

export type StudioState =
  | {
      /**
       * - `initializing`: reading from cache
       * - `waiting`: no workspace opened
       */
      readonly status: 'initializing' | 'waiting';
      // currentWorkspacePath, workspaces are from cache at this state.
      readonly currentWorkspacePath?: string;
      readonly workspaces?: readonly WorkspaceSummary[];
    }
  | {
      /**
       * - `loading`: when reading and parsing workspace files (initial,
       *   background refresh, or workspace switched).
       */
      readonly status: 'loading';
      readonly currentWorkspacePath: string;
      readonly workspaces?: readonly WorkspaceSummary[];
      readonly workspace?: Workspace;
    }
  | {
      /**
       * - `ready`: when data is ready and no file operations are in progress.
       */
      readonly status: 'ready';
      readonly currentWorkspacePath: string;
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
