import type { JsonValue, RequestMethod } from './common';

export interface MockServer {
  readonly order: number;
  readonly name: string;
  readonly port: number;
  readonly https?: {
    readonly p12File: string;
    readonly p12Password?: string;
  };
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
  readonly request?: Record<string, JsonValue>;
  readonly delay?: number;
};

export type MockServerCase =
  | MockServerCaseBase
  | (MockServerCaseBase & {
      // The response file name
      readonly response: string;
    })
  | (MockServerCaseBase & {
      readonly response: Record<string, JsonValue>;
    })
  | (MockServerCaseBase & {
      readonly forward: string;
    });
