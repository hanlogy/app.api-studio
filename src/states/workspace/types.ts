import type { AppError, RequestResource, Workspace } from '@/definitions';

export type WorkspaceStatus = 'waiting' | 'ready';

type WorkspaceContextValueBase = {
  readonly openedRequest?: RequestResource;
  readonly workspace?: Workspace;
  readonly error?: AppError;
  readonly selectedEnvironment?: string;
  readonly openWorkspace: (dir: string) => void;
  readonly openRequest?: (key: [string, string]) => void;
  readonly selectEnvironment?: (name?: string) => void;
};

export type WorkspaceContextValue =
  | (WorkspaceContextValueBase & {
      readonly status: 'waiting';
    })
  | (WorkspaceContextValueBase & {
      readonly status: 'ready';
    } & Required<
        Pick<
          WorkspaceContextValueBase,
          'workspace' | 'openRequest' | 'selectEnvironment'
        >
      >);
