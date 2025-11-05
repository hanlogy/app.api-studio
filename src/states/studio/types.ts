import { type WorkspaceSummary } from '@/definitions';

export type StudioStateStatus = 'initializing' | 'ready';

export interface StudioStateCache {
  /**
   * Recently opened workspaces
   */
  readonly workspaces?: readonly WorkspaceSummary[];
}

export type StudioContextValue =
  | {
      readonly status: 'initializing';
      workspaces?: readonly WorkspaceSummary[];
    }
  | {
      readonly status: 'ready';
      workspaces: readonly WorkspaceSummary[];
    };
