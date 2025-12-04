import { parseQueryString } from '@/helpers/parseQueryString';

describe('parseQueryString', () => {
  test('empty string', () => {
    expect(parseQueryString('')).toEqual({});
  });

  test("only '?'", () => {
    expect(parseQueryString('?')).toEqual({});
  });

  test("with leading '?'", () => {
    expect(parseQueryString('?name=foo&limit=1')).toEqual({
      name: 'foo',
      limit: '1',
    });
  });

  test('single pair', () => {
    expect(parseQueryString('name=foo')).toEqual({ name: 'foo' });
  });

  test('multiple pairs', () => {
    expect(parseQueryString('name=foo&limit=1&offset=10')).toEqual({
      name: 'foo',
      limit: '1',
      offset: '10',
    });
  });

  test('value is missing', () => {
    expect(parseQueryString('name=')).toEqual({ name: '' });
  });

  test('key is missing', () => {
    expect(parseQueryString('=foo&name=foo&&limit=1')).toEqual({
      name: 'foo',
      limit: '1',
    });
  });

  test("wotj trailing '&'", () => {
    expect(parseQueryString('name=foo&limit=1&')).toEqual({
      name: 'foo',
      limit: '1',
    });
  });

  test('with url encoded string', () => {
    expect(parseQueryString('full%20name=Foo%20Bar&action=L%C3%A4sa')).toEqual({
      'full name': 'Foo Bar',
      action: 'Läsa',
    });
  });

  test('with + in values', () => {
    expect(parseQueryString('q=hello+world+test')).toEqual({
      q: 'hello world test',
    });
  });

  test('repeated keys', () => {
    expect(parseQueryString('tag=a&tag=b&tag=c')).toEqual({
      tag: ['a', 'b', 'c'],
    });
  });

  test('mixes single and repeated keys', () => {
    expect(parseQueryString('name=foo&tag=a&tag=b&limit=1')).toEqual({
      name: 'foo',
      tag: ['a', 'b'],
      limit: '1',
    });
  });
});
