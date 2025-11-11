import type {
  JsonRecord,
  JsonValue,
  PrimitiveRecord,
  PrimitiveValue,
  ValuesMap,
} from './basic';
import { requestMethods } from './constants';

export type RequestHeaders = PrimitiveRecord<string>;
export type RequestQuery = PrimitiveRecord<string>;

export type RequestMethod = (typeof requestMethods)[number];

export interface WorkspaceResources {
  readonly config: JsonRecord;
  readonly collections: readonly JsonRecord[];
}

export type RequestResourceKey = [key: string, collectionKey: string];
export type WorkspaceResourceKey = string | RequestResourceKey;

// NOTE: The url, headers, and body should be the only resolved result, but not
// the assembled one, we assemble it at the UI rendering step
export interface RequestResource {
  readonly key: RequestResourceKey;
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
}

export type RequestResourceWithExtra = RequestResource & {
  readonly collection: Pick<
    CollectionResource,
    'name' | 'baseUrl' | 'headers' | 'valuesMap'
  >;
  readonly environments: Pick<
    WorkspaceEnvironment,
    'isGlobal' | 'headers' | 'name' | 'valuesMap'
  >[];
};

export interface CollectionResource {
  readonly key: string;
  // Must unique globally in current **workspace**.
  readonly id: string;
  readonly name: string;
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

export interface Workspace {
  readonly name: string;
  readonly dir: string;
  readonly description?: string;
  readonly environments: readonly WorkspaceEnvironment[];
  readonly collections: readonly CollectionResource[];
}

export type RuntimeVariable =
  | {
      readonly type: 'environment' | 'collection';
      readonly key: string;
      readonly name: string;
      readonly value: PrimitiveValue;
    }
  | {
      readonly type: 'request';
      readonly key: RequestResourceKey;
      readonly name: string;
      readonly value: PrimitiveValue;
    };

export interface RuntimeWorkspaceEnvironment {
  readonly name: string;
  readonly valuesMap?: ValuesMap;
}

export interface RuntimeRequestResource {
  readonly key: RequestResourceKey;
  readonly valuesMap?: ValuesMap;
}

export interface RuntimeCollectionResource {
  readonly key: string;
  readonly valuesMap?: ValuesMap;
  readonly requests?: readonly RuntimeRequestResource[];
}

export interface RuntimeWorkspace {
  readonly environments?: readonly RuntimeWorkspaceEnvironment[];
  readonly collections?: readonly RuntimeCollectionResource[];
}
