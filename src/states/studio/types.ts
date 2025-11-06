import { AppError, type WorkspaceSummary } from '@/definitions';

export type StudioStateStatus = 'initializing' | 'ready';

export interface StudioStateCache {
  /**
   * Recently opened workspaces
   */
  readonly workspaces?: readonly WorkspaceSummary[];
}

interface StudioContextValueBase {
  readonly workspaces?: readonly WorkspaceSummary[];
  readonly updateRecentWorkspace?: (workspace: WorkspaceSummary) => void;
  readonly setError: (error?: AppError) => void;
  readonly error?: AppError;
}

export type StudioContextValue =
  | (StudioContextValueBase & {
      readonly status: 'initializing';
    })
  | (StudioContextValueBase & {
      readonly status: 'ready';
    } & Required<
        Pick<StudioContextValueBase, 'workspaces' | 'updateRecentWorkspace'>
      >);
