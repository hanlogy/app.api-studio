import {
  type AppError,
  type Workspace,
  type WorkspaceSummary,
} from '@/definitions';

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
  | 'ready'
  | 'error';

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
    }
  | {
      readonly status: 'error';
      readonly error: AppError;
      readonly workspaces?: readonly WorkspaceSummary[];
      readonly workspace?: Workspace;
    };

export interface StudioStateCache {
  /**
   * Recently opened workspaces
   */
  readonly workspaces?: readonly WorkspaceSummary[];
}

export interface StudioContextValue {
  readonly state: StudioState;
  readonly openWorkspace: (dir: string) => void;
  readonly selectEnvironment: (name?: string) => void;
}
