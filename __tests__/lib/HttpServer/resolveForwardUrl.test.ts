import { resolveForwardUrl } from '@/lib/HttpServer/resolveForwardUrl';

describe('resolveForwardUrl', () => {
  test('without pathParams', () => {
    const url = resolveForwardUrl({
      template: '/static/path',
    });

    expect(url).toBe('/static/path');
  });

  test('with params', () => {
    const url = resolveForwardUrl({
      template: '/users/{{params.id }}',
      pathParams: { id: '123' },
    });

    expect(url).toBe('/users/123');
  });

  test('with wildcard', () => {
    const url = resolveForwardUrl({
      template: '/files/{{params.*}}',
      pathParams: { '*': 'foo/bar.txt' },
    });

    expect(url).toBe('/files/foo/bar.txt');
  });

  test('missing param values', () => {
    const url = resolveForwardUrl({
      template: '/users/{{params.id}}/posts/{{params.postId}}',
      pathParams: { id: '123' },
    });

    expect(url).toBe('/users/123/posts/');
  });

  test('unknown placeholder', () => {
    const url = resolveForwardUrl({
      template: '/foo/{{ foo }}',
      pathParams: { foo: 'tar' },
    });

    expect(url).toBe('/foo/{{ foo }}');
  });

  test('with query, template has no query', () => {
    const url = resolveForwardUrl({
      template: '/search',
      query: { key: 'test', page: '2' },
    });

    expect(url).toBe('/search?key=test&page=2');
  });

  test('with query string, template has query', () => {
    const url = resolveForwardUrl({
      template: '/search?fixed=1',
      query: { key: 'test', page: '2' },
    });

    expect(url).toBe('/search?fixed=1&key=test&page=2');
  });

  test('empty query', () => {
    const url = resolveForwardUrl({
      template: '/foo/{{params.id}}',
      pathParams: { id: '123' },
      query: {},
    });

    expect(url).toBe('/foo/123');
  });
});
