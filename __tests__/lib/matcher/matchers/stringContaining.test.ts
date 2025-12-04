import { stringContaining } from '@/lib/matcher/matchers/stringContaining';

describe('stringContaining', () => {
  test('name', () => {
    const matcher = stringContaining('foo');
    expect(matcher.name).toBe('stringContaining');
  });

  test('matched', () => {
    const matcher = stringContaining('foo');

    expect(matcher.test('foobar')).toBe(true);
    expect(matcher.test('barfoo')).toBe(true);
    expect(matcher.test('xxfooyy')).toBe(true);
  });

  test('not matched', () => {
    const matcher = stringContaining('foo');

    expect(matcher.test('bar')).toBe(false);
    expect(matcher.test('fo')).toBe(false);
    expect(matcher.test('')).toBe(false);
  });

  test('wrong input type', () => {
    const matcher = stringContaining('foo');

    expect(matcher.test(undefined)).toBe(false);
    expect(matcher.test(null)).toBe(false);
    expect(matcher.test(123)).toBe(false);
    expect(matcher.test({})).toBe(false);
    expect(matcher.test(['foo'])).toBe(false);
  });

  test('empty substring matches any string', () => {
    const matcher = stringContaining('');

    expect(matcher.test('anything')).toBe(true);
    expect(matcher.test('')).toBe(true);
  });
});
