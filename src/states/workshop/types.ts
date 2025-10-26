interface KeyValue<T = string | number | boolean | null> {
  readonly key: string;
  readonly value: T;
}

type Variables = readonly KeyValue[];
type RequestHeaders = readonly KeyValue<string>[];
type RequestQuery = readonly KeyValue<string>[];
type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

interface Environment {
  readonly name: string;
  readonly variables: Variables;
  // NOTE: The assembled headers. It also support variables from current node.
  readonly headers: RequestHeaders;
  readonly isGlobal: boolean;
}

// NOTE: The url, headers, query, and body should be the assembled result.
interface ApiEndpoint {
  readonly name: string;
  readonly description?: string;
  readonly url: string;
  readonly method: RequestMethod;
  readonly headers: RequestHeaders;
  readonly query: RequestQuery;
  readonly variables: Variables;
  readonly body?: KeyValue[];
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

export interface WorkspaceState {
  /**
   * - `initializing`: when the app starts before any workspace is loaded.
   * - `loading`: when reading and parsing workspace files (initial or
   *   background refresh).
   * - `idle`: when no file operations are in progress.
   */
  readonly status: 'initializing' | 'loading' | 'idle';

  // The root folder of the workspace.
  readonly path?: string;

  readonly environments: readonly Environment[];

  readonly resources: readonly (ApiEndpoint | ApiCollection)[];
}
