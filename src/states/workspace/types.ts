import type {
  AppError,
  RequestResource,
  RequestResourceKey,
  Workspace,
} from '@/definitions';
import type { HttpResponse } from '@/lib/sendRequest';

export type WorkspaceStatus = 'waiting' | 'ready';

type WorkspaceContextValueBase = {
  readonly openedRequest?: RequestResource;
  readonly workspace?: Workspace;
  readonly error?: AppError;
  readonly selectedEnvironment?: string;
  readonly saveHistory?: (
    key: RequestResourceKey,
    response: HttpResponse,
  ) => void;
  readonly getHistories?: (key: RequestResourceKey) => HttpResponse[];
  readonly openWorkspace: (args: { dir: string; environment?: string }) => void;
  readonly openRequest?: (key: RequestResourceKey) => void;
  readonly selectEnvironment?: (name?: string) => void;
};

export type OpenWorkspaceArguments = Parameters<
  WorkspaceContextValueBase['openWorkspace']
>[0];

export type WorkspaceContextValue =
  | (WorkspaceContextValueBase & {
      readonly status: 'waiting';
    })
  | (WorkspaceContextValueBase & {
      readonly status: 'ready';
    } & Required<
        Pick<
          WorkspaceContextValueBase,
          | 'workspace'
          | 'openRequest'
          | 'selectEnvironment'
          | 'saveHistory'
          | 'getHistories'
        >
      >);
