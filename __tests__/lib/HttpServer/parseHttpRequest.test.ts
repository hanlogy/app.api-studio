import { Buffer } from 'buffer';
import { parseHttpRequest } from '@/lib/HttpServer/parseHttpRequest';
import type { RequestMethod } from '@/definitions';

const buildRequestBuffer = ({
  method,
  url,
  headers = {},
  body,
}: {
  method: RequestMethod;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}) => {
  const headerItems = [`${method} ${url} HTTP/1.1`, 'Host: example.com'];

  let hasContentLength = false;
  for (const [headerKey, headerValue] of Object.entries(headers)) {
    headerItems.push(`${headerKey}: ${headerValue}`);
    if (headerKey.toLowerCase() === 'content-length') {
      hasContentLength = true;
    }
  }
  if (!hasContentLength && body !== undefined) {
    headerItems.push(`Content-Length: ${Buffer.byteLength(body, 'utf8')}`);
  }

  headerItems.push('\r\n');

  const items = [headerItems.join('\r\n')];
  if (body !== undefined) {
    items.push(body);
  }

  return Buffer.from(items.join(''), 'utf8');
};

describe('parseHttpRequest', () => {
  test('headers are not complete', () => {
    const raw = 'GET / HTTP/1.1\r\nHost: example.com\r\n';
    const buffer = Buffer.from(raw, 'utf8');
    const parsed = parseHttpRequest(buffer);

    expect(parsed).toBeUndefined();
  });

  test('GET request without body', () => {
    const buffer = buildRequestBuffer({
      method: 'GET',
      url: '/hello/world',
    });

    const parsed = parseHttpRequest(buffer);

    expect(parsed).toStrictEqual({
      method: 'GET',
      path: 'hello/world',
      rawPath: '/hello/world',
      headers: {
        host: 'example.com',
      },
      body: '',
    });
  });

  test('GET with query', () => {
    const buffer = buildRequestBuffer({
      method: 'GET',
      url: '/hello/world?foo=bar&baz=qux',
    });

    const parsed = parseHttpRequest(buffer);

    expect(parsed).toMatchObject({
      method: 'GET',
      path: 'hello/world',
      rawPath: '/hello/world?foo=bar&baz=qux',
      query: {
        foo: 'bar',
        baz: 'qux',
      },
    });
  });

  test('Content-length is larger than available bytes', () => {
    const body = '{"a":1}';
    const buffer = buildRequestBuffer({
      method: 'POST',
      url: '/api/test',
      headers: {
        'Content-Length': String(Buffer.byteLength(body, 'utf8')) + 10,
        'Content-Type': 'application/json',
      },
      body,
    });
    const parsed = parseHttpRequest(buffer);

    expect(parsed).toBeUndefined();
  });

  test('json body type', () => {
    const body = JSON.stringify({ a: 1, b: 'x' });

    const buffer = buildRequestBuffer({
      method: 'POST',
      url: '/api/test?ok=1',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body,
    });

    const parsed = parseHttpRequest(buffer);

    expect(parsed).toStrictEqual({
      method: 'POST',
      path: 'api/test',
      rawPath: '/api/test?ok=1',
      query: { ok: '1' },
      headers: {
        host: 'example.com',
        'content-length': `${Buffer.byteLength(body, 'utf8')}`,
        'content-type': 'application/json; charset=utf-8',
      },
      body: { a: 1, b: 'x' },
    });
  });

  test('falls back to raw body string when JSON is invalid', () => {
    const body = '{"a":1,}';
    const buffer = buildRequestBuffer({
      method: 'POST',
      url: '/api/test',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body,
    });

    const parsed = parseHttpRequest(buffer);

    expect(parsed?.body).toBe(body);
  });
});
