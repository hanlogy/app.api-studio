import type {PrimitiveRecord, PrimitiveType, ValuesMap} from './basic';
import {CONFIG_FILE} from './constants';

export type RequestHeaders = PrimitiveRecord<string>;
export type RequestBody =
  | PrimitiveType
  | RequestBody[]
  | {[key: string]: RequestBody};

type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

export interface WorkspaceFiles {
  readonly config?: typeof CONFIG_FILE;
  readonly apis?: string[];
}

export type WorkspaceEnvironment =
  | {
      readonly isGlobal: true;
      readonly valuesMap: ValuesMap;
      readonly headers: RequestHeaders;
    }
  | {
      readonly name: string;
      readonly valuesMap: ValuesMap;
      // NOTE: The assembled headers. It also support valuesMap from current
      // node.
      readonly headers: RequestHeaders;
    };

// NOTE: The url, headers, and body should be the assembled result.
export interface ApiResource {
  // The id must globally unique in a workspace.
  readonly id?: string;
  readonly name: string;
  readonly description?: string;
  readonly url: string;
  readonly method: RequestMethod;
  readonly headers: RequestHeaders;
  readonly valuesMap: ValuesMap;
  readonly body?: RequestBody;
}

// NOTE: The baseUrl, and headers should be the assembled result.
export interface CollectionResource {
  readonly name: string;
  readonly description?: string;
  readonly headers: RequestHeaders;
  readonly valuesMap: ValuesMap;
  readonly baseUrl?: string;
  readonly apis: readonly ApiResource[];
}

export interface WorkspaceSummary {
  readonly name: string;
  readonly path: string;
}

export type WorkspaceResource = ApiResource | CollectionResource;

export interface Workspace extends WorkspaceSummary {
  readonly description?: string;
  readonly environments: readonly WorkspaceEnvironment[];

  readonly resources: readonly WorkspaceResource[];
}
