import { AppError } from '@/definitions';

export type StudioStateStatus = 'initializing' | 'ready';

export interface WorkspaceCache {
  readonly name: string;
  readonly dir: string;
  /**
   * Name of the selected environment.
   */
  readonly selectedEnvironment?: string;
}

export interface StudioStateCache {
  /**
   * Recently opened workspaces
   */
  readonly workspaces?: readonly WorkspaceCache[];
}

interface StudioContextValueBase {
  readonly workspaces?: readonly WorkspaceCache[];
  readonly updateRecentWorkspace?: (workspace: WorkspaceCache) => void;
  readonly setError: (error?: AppError) => void;
  readonly error?: AppError;
  readonly currentWorkspace?: { dir: string; environment?: string };
  readonly setCurrentWorkspace?: (args: {
    dir: string;
    environment?: string;
  }) => void;
}

export type StudioContextValue =
  | (StudioContextValueBase & {
      readonly status: 'initializing';
    })
  | (StudioContextValueBase & {
      readonly status: 'ready';
    } & Required<
        Pick<
          StudioContextValueBase,
          'workspaces' | 'updateRecentWorkspace' | 'setCurrentWorkspace'
        >
      >);
