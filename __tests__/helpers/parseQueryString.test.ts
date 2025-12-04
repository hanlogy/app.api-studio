import { parseQueryString } from '@/helpers/parseQueryString';

describe('parseQueryString', () => {
  test('undefined string', () => {
    expect(parseQueryString()).toStrictEqual({});
  });

  test('empty string', () => {
    expect(parseQueryString('')).toStrictEqual({});
  });

  test("only '?'", () => {
    expect(parseQueryString('?')).toStrictEqual({});
  });

  test("with leading '?'", () => {
    expect(parseQueryString('?name=foo&limit=1')).toStrictEqual({
      name: 'foo',
      limit: '1',
    });
  });

  test('single pair', () => {
    expect(parseQueryString('name=foo')).toStrictEqual({ name: 'foo' });
  });

  test('multiple pairs', () => {
    expect(parseQueryString('name=foo&limit=1&offset=10')).toStrictEqual({
      name: 'foo',
      limit: '1',
      offset: '10',
    });
  });

  test('value is missing', () => {
    expect(parseQueryString('name=')).toStrictEqual({ name: '' });
  });

  test('key is missing', () => {
    expect(parseQueryString('=foo&name=foo&&limit=1')).toStrictEqual({
      name: 'foo',
      limit: '1',
    });
  });

  test("wotj trailing '&'", () => {
    expect(parseQueryString('name=foo&limit=1&')).toStrictEqual({
      name: 'foo',
      limit: '1',
    });
  });

  test('with url encoded string', () => {
    expect(
      parseQueryString('full%20name=Foo%20Bar&action=L%C3%A4sa'),
    ).toStrictEqual({
      'full name': 'Foo Bar',
      action: 'Läsa',
    });
  });

  test('with + in values', () => {
    expect(parseQueryString('q=hello+world+test')).toStrictEqual({
      q: 'hello world test',
    });
  });

  test('repeated keys', () => {
    expect(parseQueryString('tag=a&tag=b&tag=c')).toStrictEqual({
      tag: ['a', 'b', 'c'],
    });
  });

  test('mixes single and repeated keys', () => {
    expect(parseQueryString('name=foo&tag=a&tag=b&limit=1')).toStrictEqual({
      name: 'foo',
      tag: ['a', 'b'],
      limit: '1',
    });
  });
});
