import { serializeServerResponse } from '@/lib/HttpServer/serializeServerResponse';

describe('serializeServerResponse', () => {
  test('all good', () => {
    const response = {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
      body: 'hello',
    };

    const serialized = serializeServerResponse(response);

    const expected =
      'HTTP/1.1 200 OK\r\n' +
      'Connection: close\r\n' +
      'Content-Type: text/plain; charset=utf-8\r\n' +
      'Content-Length: 5' +
      '\r\n\r\n' +
      'hello';

    expect(serialized).toStrictEqual(expected);
  });

  test('unknown status', () => {
    const response = {
      status: 999,
      headers: {},
      body: 'teapot',
    };

    const serialized = serializeServerResponse(response);

    const expected =
      'HTTP/1.1 999 Unknown\r\n' +
      'Connection: close\r\n' +
      'Content-Length: 6' +
      '\r\n\r\n' +
      'teapot';

    expect(serialized).toStrictEqual(expected);
  });

  test('override Content-Length', () => {
    const response = {
      status: 200,
      headers: {
        Connection: 'keep-alive',
        'X-Test': '1',
        'Content-Length': '999',
      },
      body: 'foo',
    };

    const serialized = serializeServerResponse(response);

    const expected =
      'HTTP/1.1 200 OK\r\n' +
      'Connection: keep-alive\r\n' +
      'X-Test: 1\r\n' +
      'Content-Length: 3' +
      '\r\n\r\n' +
      'foo';

    expect(serialized).toStrictEqual(expected);
  });
});
