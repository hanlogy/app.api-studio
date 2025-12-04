import type {
  JsonValue,
  RequestHeaders,
  RequestMethod,
  RequestQuery,
} from './common';

export interface MockServer {
  readonly order: number;
  readonly name: string;
  readonly port: number;
  readonly https?: {
    readonly p12File: string;
    readonly p12Password?: string;
  };
  // Global response header. It does not apply to `forward` case.
  readonly headers?: Record<string, string>;
  readonly routes: readonly MockServerRoute[];
}

export interface MockServerRoute {
  readonly order: number;
  readonly name: string;
  readonly method: RequestMethod | 'ALL';
  readonly path: string;
  readonly delay?: number;
  readonly cases: readonly MockServerCase[];
}

type MockServerCaseBase = {
  readonly request?: MockServerRequest;
  readonly delay?: number;
};

export type MockServerCase =
  | MockServerCaseBase
  | (MockServerCaseBase & {
      readonly response: MockServerResponse;
    })
  | (MockServerCaseBase & {
      readonly forward: string;
    });

interface MockServerRequest {
  readonly query?: RequestQuery;
  readonly headers?: RequestHeaders;
  readonly body?: JsonValue;
}

interface MockServerResponse {
  readonly status?: number;
  readonly headers?: RequestHeaders;
  readonly body?: JsonValue;
}
