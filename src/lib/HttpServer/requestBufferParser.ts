import { Buffer } from 'buffer';
import type { JsonRecord } from '@/definitions';
import { removeUndefined } from '@/helpers/filterValues';
import type { ParsedRequest } from './definitions';

export function requestBufferParser(buffer: Buffer): ParsedRequest | undefined {
  const headerEnd = buffer.indexOf('\r\n\r\n');
  if (headerEnd === -1) {
    return;
  }

  const headerPart = buffer.toString('utf8', 0, headerEnd);
  const lines = headerPart.split('\r\n');
  const [requestLine, ...headerLines] = lines;

  const headers = Object.fromEntries(
    headerLines
      .map(line => {
        const lineParts = line.split(':');
        if (lineParts.length < 2) {
          return undefined;
        }
        const [name, ...valueParts] = lineParts;

        if (!name.trim()) {
          return undefined;
        }

        return [name.toLowerCase(), valueParts.join(':').trim()] as const;
      })
      .filter(e => e !== undefined),
  );

  let contentLength = 0;
  if ('content-length' in headers) {
    const parsed = parseInt(headers['content-length'], 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      contentLength = parsed;
    }
  }

  const bytesAfterHeaders = buffer.length - (headerEnd + 4);
  if (bytesAfterHeaders < contentLength) {
    return;
  }

  const bodyBuffer = buffer.subarray(
    headerEnd + 4,
    headerEnd + 4 + contentLength,
  );

  const bodyText = bodyBuffer.toString('utf8');

  const [method, rawPath = '/', _httpVersion] = requestLine.split(' ');
  const [pathOnly, queryString] = rawPath.split('?');

  const path = pathOnly.replace(/^\/+/, '') || '/';

  const query = queryString
    ? Object.fromEntries(new URLSearchParams(queryString))
    : undefined;

  let bodyJson: JsonRecord | undefined;
  const contentType = headers['content-type'] ?? '';
  if (contentType.includes('application/json') && bodyText) {
    try {
      bodyJson = JSON.parse(bodyText);
    } catch {
      // ignore
    }
  }

  return removeUndefined({
    method,
    path,
    rawPath,
    query,
    headers,
    body: bodyJson ?? bodyText,
  });
}
