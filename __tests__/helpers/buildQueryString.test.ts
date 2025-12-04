import { buildQueryString } from '@/helpers/buildQueryString';

describe('buildQueryString', () => {
  test('empty object', () => {
    const input = {};
    expect(buildQueryString(input)).toBe('');
  });

  test('a single pair', () => {
    const input = { name: 'foo' };
    expect(buildQueryString(input)).toBe('name=foo');
  });

  test('multiple pairs', () => {
    const input = { name: 'foo', limit: '1', offset: '10' };
    expect(buildQueryString(input)).toBe('name=foo&limit=1&offset=10');
  });

  test('with space in value', () => {
    const input = { q: 'hello world test' };
    expect(buildQueryString(input)).toBe('q=hello+world+test');
  });

  test('encodes reserved and non-ASCII characters', () => {
    const input = {
      'full name': 'Foo Bar',
      action: 'Läsa',
      special: 'a&b=c',
    };

    expect(buildQueryString(input)).toBe(
      'full+name=Foo+Bar&action=L%C3%A4sa&special=a%26b%3Dc',
    );
  });

  test('array values', () => {
    const input = { tag: ['a', 'b', 'c'] };
    expect(buildQueryString(input)).toBe('tag=a&tag=b&tag=c');
  });

  test('mixes single and array values', () => {
    const input = {
      name: 'foo',
      tag: ['a', 'b'],
      limit: '1',
    };
    expect(buildQueryString(input)).toBe('name=foo&tag=a&tag=b&limit=1');
  });

  test('empty strings', () => {
    const input = { name: '' };
    expect(buildQueryString(input)).toBe('name=');
  });

  test('empty strings inside arrays', () => {
    const input = { tag: ['', 'a'] };
    expect(buildQueryString(input)).toBe('tag=&tag=a');
  });
});
