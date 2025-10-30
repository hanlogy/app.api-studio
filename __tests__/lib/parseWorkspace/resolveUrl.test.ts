import {resolveUrl} from '@/lib/parseWorkspace/resolveUrl';

describe('resolveUrl', () => {
  test('empty', () => {
    const result = resolveUrl();
    expect(result).toBe('');
  });

  test('only url', () => {
    const result = resolveUrl({url: 'foo'});
    expect(result).toBe('foo');
  });

  test('only baseUrl', () => {
    const result = resolveUrl({baseUrl: 'bar'});
    expect(result).toBe('bar');
  });

  test('baseUrl + url', () => {
    const result = resolveUrl({baseUrl: 'bar', url: 'foo'});
    expect(result).toBe('bar/foo');
  });

  test('only baseUrl and contains query with query input', () => {
    const result = resolveUrl({baseUrl: 'bar?key=foo', query: {limit: 10}});
    expect(result).toBe('bar?key=foo&limit=10');
  });

  test('all features in one', () => {
    const result = resolveUrl({
      baseUrl: 'http://localhost/{{version}}',
      url: 'bar?key={{key}}',
      query: {
        limit: '{{limit}}',
      },
      valuesMap: {
        version: 'v1',
        key: 'foo',
        limit: 10,
      },
    });
    expect(result).toBe('http://localhost/v1/bar?key=foo&limit=10');
  });
});
