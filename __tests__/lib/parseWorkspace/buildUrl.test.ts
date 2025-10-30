import {buildUrl} from '@/lib/parseWorkspace/buildUrl';

describe('buildUrl', () => {
  test('empty', () => {
    const result = buildUrl();
    expect(result).toBe('');
  });

  test('only url', () => {
    const result = buildUrl({url: 'foo'});
    expect(result).toBe('foo');
  });

  test('only baseUrl', () => {
    const result = buildUrl({baseUrl: 'bar'});
    expect(result).toBe('bar');
  });

  test('baseUrl + url', () => {
    const result = buildUrl({baseUrl: 'bar', url: 'foo'});
    expect(result).toBe('bar/foo');
  });

  test('only baseUrl and contains query with query input', () => {
    const result = buildUrl({baseUrl: 'bar?key=foo', query: {limit: 10}});
    expect(result).toBe('bar?key=foo&limit=10');
  });

  test('all features in one', () => {
    const result = buildUrl({
      baseUrl: 'http://localhost/{{version}}',
      url: 'bar?key={{key}}',
      query: {
        limit: '{{limit}}',
      },
      variables: {
        version: 'v1',
        key: 'foo',
        limit: 10,
      },
    });
    expect(result).toBe('http://localhost/v1/bar?key=foo&limit=10');
  });
});
