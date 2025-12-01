import { stringMatching } from '@/lib/matcher/matchers/stringMatching';

describe('stringMatching', () => {
  test('name', () => {
    const matcher = stringMatching('foo');

    expect(matcher.name).toBe('stringMatching');
  });

  describe('not a regexp string', () => {
    test('uses source as a RegExp pattern', () => {
      const matcher = stringMatching('foo');

      expect(matcher.test('foo')).toBe(true);
      expect(matcher.test('xxfooyy')).toBe(true);
      expect(matcher.test('bar')).toBe(false);
      expect(matcher.test('')).toBe(false);
    });

    test('empty pattern matches any string', () => {
      const matcher = stringMatching('');

      expect(matcher.test('')).toBe(true);
      expect(matcher.test('anything')).toBe(true);
    });
  });

  describe('regexp pattern', () => {
    test('without flags', () => {
      const matcher = stringMatching('/foo/');

      expect(matcher.test('foo')).toBe(true);
      expect(matcher.test('xxfooyy')).toBe(true);
      expect(matcher.test('FOO')).toBe(false);
      expect(matcher.test('bar')).toBe(false);
    });

    test('with flags', () => {
      const matcher = stringMatching('/foo/i');

      expect(matcher.test('foo')).toBe(true);
      expect(matcher.test('FOO')).toBe(true);
      expect(matcher.test('xxFoOy')).toBe(true);
      expect(matcher.test('bar')).toBe(false);
    });

    test('complex patterns', () => {
      const matcher = stringMatching('/^foo[0-9]+$/');

      expect(matcher.test('foo1')).toBe(true);
      expect(matcher.test('foo123')).toBe(true);
      expect(matcher.test('foo')).toBe(false);
      expect(matcher.test('bar123')).toBe(false);
    });
  });

  test('wrong actual types', () => {
    const matcher = stringMatching('foo');

    expect(matcher.test(undefined)).toBe(false);
    expect(matcher.test(null)).toBe(false);
    expect(matcher.test(123)).toBe(false);
    expect(matcher.test({})).toBe(false);
    expect(matcher.test(['foo'])).toBe(false);
  });

  test('RegExp object', () => {
    const matcher = stringMatching(new RegExp('foo', 'i'));

    expect(matcher.test('foo')).toBe(true);
    expect(matcher.test('FOO')).toBe(true);
    expect(matcher.test('xxFoOy')).toBe(true);
    expect(matcher.test('bar')).toBe(false);
  });
});
