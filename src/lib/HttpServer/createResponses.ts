import type { ServerResponse } from './definitions';

interface Props {
  readonly headers?: Record<string, string>;
  readonly status: number;
  readonly body: string;
}

export function createTextResponse({
  headers = {},
  status,
  body,
}: Props): ServerResponse {
  return {
    headers: {
      ...headers,
      'content-type': 'text/plain; charset=utf-8',
    },
    status,
    body,
  };
}

export function createJsonResponse({
  headers = {},
  status,
  body,
}: Props): ServerResponse {
  return {
    headers: {
      ...headers,
      'content-type': 'application/json; charset=utf-8',
    },
    status,
    body,
  };
}
