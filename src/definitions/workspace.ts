import type {
  JsonRecord,
  JsonValue,
  RequestHeaders,
  RequestMethod,
  RequestQuery,
  ValuesMap,
} from './common';

import type { MockServer } from './mockServer';

export type RequestKey = [key: string, collectionKey: string];
export type WorkspaceResourceKey = string | RequestKey;

// The raw json read from files
export interface WorkspaceSource {
  readonly config: JsonRecord;
  readonly collections: readonly JsonRecord[];
  readonly servers: readonly JsonRecord[];
}

export interface Workspace {
  readonly name: string;
  readonly dir: string;
  readonly description?: string;
  readonly environments: readonly WorkspaceEnvironment[];
  readonly collections: readonly Collection[];
  readonly mockServers: readonly MockServer[];
}

export interface WorkspaceEnvironment {
  readonly isGlobal: boolean;
  readonly name: string;
  readonly valuesMap?: ValuesMap;
  readonly headers?: RequestHeaders;
}

export interface Collection {
  readonly key: string;
  // Must unique globally in current **workspace**.
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly headers?: RequestHeaders;
  readonly valuesMap?: ValuesMap;
  readonly baseUrl?: string;
  readonly requests: readonly Request[];
  readonly order: number;
}

// NOTE: The url, headers, and body should be the only resolved result, but not
// the assembled one, we assemble it at the UI rendering step
export interface Request {
  readonly key: RequestKey;
  // Must unique globally in current **workspace**, it allows users to move
  // the request to differnt collection
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly method?: RequestMethod;
  readonly url?: string;
  readonly headers?: RequestHeaders;
  readonly query?: RequestQuery;
  readonly valuesMap?: ValuesMap;
  readonly body?: JsonValue;
  readonly order: number;
}

export type RequestWithExtra = Request & {
  readonly collection: Pick<
    Collection,
    'name' | 'baseUrl' | 'headers' | 'valuesMap'
  >;
  readonly environments: Pick<
    WorkspaceEnvironment,
    'isGlobal' | 'headers' | 'name' | 'valuesMap'
  >[];
};
