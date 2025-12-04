import type { ServerRequest } from '@/lib/HttpServer/definitions';
import { forwardRequest } from '@/lib/HttpServer/forwardRequest';
import { resolveForwardUrl } from '@/lib/HttpServer/resolveForwardUrl';

jest.mock('@/lib/HttpServer/resolveForwardUrl', () => ({
  resolveForwardUrl: jest.fn(),
}));

const mockFetch = ((global as any).fetch = jest.fn());
const mockedResolveForwardUrl = jest.mocked(resolveForwardUrl);

function makeRequest(partial: Partial<ServerRequest> = {}): ServerRequest {
  return {
    path: '',
    rawPath: '',
    method: 'GET',
    headers: {},
    body: '',
    ...partial,
  };
}

function mockFetchResponse({
  status = 200,
  headers = {},
  body = 'ok',
}: {
  status?: number;
  headers?: Record<string, string>;
  body?: string;
}) {
  mockFetch.mockResolvedValue({
    status,
    headers: new Map(Object.entries(headers)),
    text: jest.fn().mockResolvedValue(body),
  });
}

beforeEach(() => {
  mockedResolveForwardUrl.mockReset();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('forwardRequest', () => {
  test('calls resolveForwardUrl with right params', async () => {
    mockedResolveForwardUrl.mockReturnValue(
      'https://api.example.com/user/john',
    );

    mockFetchResponse({ status: 200, headers: { 'x-up': '1' }, body: 'ok' });

    const request = makeRequest({
      method: 'GET',
      headers: {},
      query: { status: 'open' },
      pathParams: { name: 'john' },
    });

    await forwardRequest({
      template: 'https://api.example.com/user/{{params.name}}',
      request,
    });

    expect(mockedResolveForwardUrl).toHaveBeenCalledTimes(1);
    expect(mockedResolveForwardUrl).toHaveBeenCalledWith({
      template: 'https://api.example.com/user/{{params.name}}',
      query: { status: 'open' },
      pathParams: { name: 'john' },
    });
  });

  test('strips hop-by-hop headers', async () => {
    mockedResolveForwardUrl.mockReturnValue('https://api.example.com/users');

    mockFetchResponse({
      status: 200,
      headers: { 'x-up': '1' },
      body: 'ok',
    });

    const request = makeRequest({
      method: 'GET',
      headers: {
        host: 'localhost:3000',
        'content-length': '123',
        connection: 'keep-alive',
        'x-custom': 'abc',
      },
    });

    const res = await forwardRequest({
      template: 'https://api.example.com/users',
      request,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];

    expect(url).toBe('https://api.example.com/users');
    expect(init.method).toBe('GET');
    expect(init.body).toBeUndefined();
    expect(init.headers).toEqual({ 'x-custom': 'abc' });

    expect(res.status).toBe(200);
    expect(res.headers).toEqual({ 'x-up': '1' });
    expect(res.body).toBe('ok');
  });

  test('POST with string body ', async () => {
    mockedResolveForwardUrl.mockReturnValue('https://api.example.com/users');

    mockFetchResponse({ status: 201, headers: {}, body: 'created' });

    const request = makeRequest({
      method: 'POST',
      body: 'raw-body',
    });

    const res = await forwardRequest({
      template: 'https://api.example.com/users',
      request,
    });

    const [, init] = mockFetch.mock.calls[0];

    expect(init.method).toBe('POST');
    expect(init.body).toBe('raw-body');

    expect(res.status).toBe(201);
    expect(res.body).toBe('created');
  });

  test('POST with JSON body', async () => {
    mockedResolveForwardUrl.mockReturnValue('https://api.example.com/users');

    mockFetchResponse({ status: 200, headers: {}, body: 'ok' });

    const jsonBody = { foo: 'bar', n: 1 };
    const request = makeRequest({
      method: 'POST',
      body: jsonBody,
    });

    await forwardRequest({
      template: 'https://api.example.com/users',
      request,
    });

    const [, init] = mockFetch.mock.calls[0];

    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify(jsonBody));
  });

  test('HEAD method', async () => {
    mockedResolveForwardUrl.mockReturnValue('https://api.example.com/users');

    mockFetchResponse({ status: 200, headers: {}, body: '' });

    const request = makeRequest({
      method: 'HEAD',
      body: 'should-be-ignored',
    });

    await forwardRequest({
      template: 'https://api.example.com/users',
      request,
    });

    const [, init] = mockFetch.mock.calls[0];

    expect(init.method).toBe('HEAD');
    expect(init.body).toBeUndefined();
  });

  test('returns 502', async () => {
    mockedResolveForwardUrl.mockReturnValue('https://api.example.com/users');

    mockFetch.mockRejectedValue(new Error('foo'));

    const request = makeRequest({
      method: 'GET',
    });

    const res = await forwardRequest({
      template: 'https://api.example.com/users',
      request,
    });

    expect(res.status).toBe(502);
    expect(res.headers).toEqual({
      'content-type': 'text/plain; charset=utf-8',
    });
    expect(res.body).toContain('Failed to forward');
    expect(res.body).toContain('foo');
  });
});
