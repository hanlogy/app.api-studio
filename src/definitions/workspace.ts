import type { JsonValue, PrimitiveRecord, ValuesMap } from './basic';
import { requestMethods, WORKSPACE_CONFIG_FILE } from './constants';

export type RequestHeaders = PrimitiveRecord<string>;
export type RequestQuery = PrimitiveRecord<string>;

export type RequestMethod = (typeof requestMethods)[number];

export interface WorkspaceFiles {
  readonly config: typeof WORKSPACE_CONFIG_FILE;
  readonly collections: readonly string[];
}

// NOTE: The url, headers, and body should be the only resolved result, but not
// the assembled one, we assemble it at the UI rendering step
export interface RequestResource {
  readonly key: string;
  // Must unique globally in current **workspace**, it allows users to move
  // the request to differnt collection
  readonly id?: string;
  readonly name?: string;
  readonly description?: string;
  readonly method?: RequestMethod;
  readonly url?: string;
  readonly headers?: RequestHeaders;
  readonly query?: RequestQuery;
  readonly valuesMap?: ValuesMap;
  readonly body?: JsonValue;
}

export interface CollectionResource {
  readonly key: string;
  // Must unique globally in current **workspace**.
  readonly id?: string;
  readonly name?: string;
  readonly description?: string;
  readonly headers?: RequestHeaders;
  readonly valuesMap?: ValuesMap;
  readonly baseUrl?: string;
  readonly requests: readonly RequestResource[];
}

export interface WorkspaceEnvironment {
  readonly isGlobal: boolean;
  readonly name: string;
  readonly valuesMap?: ValuesMap;
  readonly headers?: RequestHeaders;
}

export interface WorkspaceSummary {
  readonly name?: string;
  readonly dir: string;
  /**
   * Name of the selected environment.
   */
  readonly environmentName?: string;
}

export interface Workspace extends WorkspaceSummary {
  readonly description?: string;
  readonly environments: readonly WorkspaceEnvironment[];
  readonly collections: readonly CollectionResource[];
}
