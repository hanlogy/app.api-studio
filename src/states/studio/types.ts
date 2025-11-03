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

type BaseStudioState = {
  readonly workspaces?: readonly WorkspaceSummary[];
  readonly workspace?: Workspace;
  readonly error?: AppError;
};

export type StudioState =
  | (BaseStudioState & {
      readonly status: 'initializing';
    })
  | (BaseStudioState & {
      readonly status: 'waiting';
    } & Required<Pick<BaseStudioState, 'workspaces'>>)
  | (BaseStudioState & {
      readonly status: 'loading';
    } & Required<Pick<BaseStudioState, 'workspaces'>>)
  | (BaseStudioState & {
      readonly status: 'ready';
    } & Required<Pick<BaseStudioState, 'workspaces' | 'workspace'>>)
  | (BaseStudioState & {
      readonly status: 'error';
    } & Required<Pick<BaseStudioState, 'error'>>);

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
