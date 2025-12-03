import { Buffer } from 'buffer';
import type { ServerResponse } from './definitions';

const STATUS_REASONS: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',

  301: 'Moved Permanently',
  302: 'Found',

  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',

  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

export function serializeServerResponse(response: ServerResponse): string {
  const body = response.body;

  const headers = {
    Connection: 'close',
    ...(response.headers ?? {}),
    'Content-Length': String(Buffer.from(body, 'utf8').byteLength),
  };

  const headerLines = Object.entries(headers).map(([k, v]) => `${k}: ${v}`);
  const statusReason = STATUS_REASONS[response.status] ?? 'Unknown';

  return (
    `HTTP/1.1 ${response.status} ${statusReason}\r\n` +
    headerLines.join('\r\n') +
    '\r\n\r\n' +
    body
  );
}
