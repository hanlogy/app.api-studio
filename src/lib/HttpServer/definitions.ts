import type {
  JsonRecord,
  PathParams,
  RequestHeaders,
  RequestQuery,
} from '@/definitions';

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
  headers?: RequestHeaders;
  body: string;
};

/**
 * The request recieved at server side.
 */
export interface ServerRequest {
  readonly method: string;
  readonly path: string;
  readonly rawPath: string;
  readonly headers: RequestHeaders;
  readonly pathParams?: PathParams;
  readonly query?: RequestQuery;
  readonly body: string | JsonRecord;
}
