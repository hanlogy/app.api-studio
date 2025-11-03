import type {JsonValue, PrimitiveRecord, ValuesMap} from './basic';
import {requestMethods} from './constants';

export type RequestHeaders = PrimitiveRecord<string>;
export type RequestQuery = PrimitiveRecord<string>;

export type RequestMethod = (typeof requestMethods)[number];

// NOTE: The url, headers, and body should be the only resolved result, but not
// the assembled one, we assemble it at the UI rendering step
export interface ApiResource {
  // The id must globally unique in a workspace.
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
  readonly name?: string;
  readonly description?: string;
  readonly headers?: RequestHeaders;
  readonly valuesMap?: ValuesMap;
  readonly baseUrl?: string;
  readonly apis: readonly ApiResource[];
}

export interface WorkspaceEnvironment {
  readonly isGlobal: boolean;
  readonly name: string;
  readonly valuesMap?: ValuesMap;
  readonly headers?: RequestHeaders;
}

export interface WorkspaceSummary {
  readonly name?: string;
  /**
   * Name of the selected environment.
   */
  readonly environmentName?: string;
  readonly path: string;
}

export interface Workspace extends WorkspaceSummary {
  readonly description?: string;
  readonly environments: readonly WorkspaceEnvironment[];
  readonly apis: readonly (ApiResource | CollectionResource)[];
}
