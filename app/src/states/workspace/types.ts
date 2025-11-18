import type {
  AppError,
  RequestResourceKey,
  Workspace,
  WorkspaceResourceKey,
} from '@/definitions';
import type { HttpRequest, HttpResponse } from '@/lib/sendHttpRequest';

export type WorkspaceStatus = 'waiting' | 'ready';

export interface RequestHistoryItem {
  readonly request: HttpRequest;
  readonly response: HttpResponse;
}

type WorkspaceContextValueBase = {
  readonly workspace?: Workspace;
  readonly error?: AppError;
  readonly selectedEnvironment?: string;
  readonly currentResourceKey?: WorkspaceResourceKey;
  readonly histories: readonly {
    key: RequestResourceKey;
    items: readonly RequestHistoryItem[];
  }[];
  readonly sendRequest?: () => Promise<void>;
  readonly openResource?: (key: WorkspaceResourceKey) => void;
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
          'workspace' | 'openResource' | 'selectEnvironment' | 'sendRequest'
        >
      >);
