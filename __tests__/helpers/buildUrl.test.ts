import {buildUrl} from '@/helpers/buildUrl';

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
    const result = buildUrl({baseUrl: 'bar?key=foo', query: {limit: '10'}});
    expect(result).toBe('bar?key=foo&limit=10');
  });
});
