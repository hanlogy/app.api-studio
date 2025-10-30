import {CONFIG_FILE} from './constants';

type PrimitiveRecord<T = string | number | boolean | null> = Record<string, T>;

export type Variables = PrimitiveRecord;
export type RequestHeaders = PrimitiveRecord<string>;
type RequestQuery = PrimitiveRecord<string>;
type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

export interface WorkspaceFiles {
  readonly config?: typeof CONFIG_FILE;
  readonly apis?: string[];
}

export type WorkspaceEnvironment =
  | {
      readonly isGlobal: true;
      readonly variables: Variables;
      readonly headers: RequestHeaders;
    }
  | {
      readonly name: string;
      readonly variables: Variables;
      // NOTE: The assembled headers. It also support variables from current node.
      readonly headers: RequestHeaders;
    };

// NOTE: The url, headers, query, and body should be the assembled result.
interface ApiEndpoint {
  // The id must globally unique in a workspace.
  readonly id?: string;
  readonly name: string;
  readonly description?: string;
  readonly url: string;
  readonly method: RequestMethod;
  readonly headers: RequestHeaders;
  readonly query: RequestQuery;
  readonly variables: Variables;
  readonly body?: PrimitiveRecord<string>;
}

// NOTE: The baseUrl, and headers should be the assembled result.
interface ApiCollection {
  readonly name: string;
  readonly description?: string;
  readonly headers: RequestHeaders;
  readonly variables: Variables;
  readonly baseUrl?: string;
  readonly endpoints: readonly ApiEndpoint[];
}

export interface WorkspaceSummary {
  readonly name: string;
  readonly path: string;
}

export type WorkspaceResource = ApiEndpoint | ApiCollection;

export interface Workspace extends WorkspaceSummary {
  readonly description?: string;
  readonly environments: readonly WorkspaceEnvironment[];

  readonly resources: readonly WorkspaceResource[];
}

export interface StudioStateCache {
  readonly currentWorkspacePath: string;
  readonly workspaces: readonly WorkspaceSummary[];
}

export type StudioState =
  | {
      /**
       * - `initializing`: reading from cache
       * - `waiting`: no cache
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

export interface StudioContextValue {
  readonly state: StudioState;
  readonly openWorkspace: (path: string) => void;
}
