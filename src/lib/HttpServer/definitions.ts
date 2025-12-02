import type { JsonRecord } from '@/definitions';

export interface RequestEvent {
  readonly port: number;
  readonly connectionId: string;
  readonly chunk: number[];
}

export interface ErrorEvent {
  readonly port: number;
  readonly error: string;
}

export type ServerResponse = {
  status: number;
  headers?: Record<string, string>;
  body: string;
};

/**
 * The request recieved at server side.
 */
export interface ServerRequest {
  readonly method: string;
  readonly path: string;
  readonly rawPath: string;
  readonly headers: Record<string, string>;
  readonly pathParams?: Record<string, string>;
  readonly query?: Record<string, string>;
  readonly body: string | JsonRecord;
}
