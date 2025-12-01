import { any } from '@/lib/matcher/matchers/any';

describe('any', () => {
  test('matcher name', () => {
    expect(any(String).name).toBe('any(String)');
  });

  describe('String', () => {
    test('Constructor', () => {
      const matcher = any(String);

      expect(matcher.test('hello')).toBe(true);
      expect(matcher.test('')).toBe(true);
      expect(matcher.test(123)).toBe(false);
      expect(matcher.test(false)).toBe(false);
      expect(matcher.test(null)).toBe(false);
      expect(matcher.test(undefined)).toBe(false);
    });

    test('String name', () => {
      const matcher = any('String');

      expect(matcher.test('')).toBe(true);
      expect(matcher.test(123)).toBe(false);
      expect(matcher.test(false)).toBe(false);
      expect(matcher.test(null)).toBe(false);
      expect(matcher.test(undefined)).toBe(false);
    });
  });

  describe('Number', () => {
    test('Constructor', () => {
      const matcher = any(Number);

      expect(matcher.test(0)).toBe(true);
      expect(matcher.test(123)).toBe(true);
      expect(matcher.test(-1)).toBe(true);
      expect(matcher.test(NaN)).toBe(true);
      expect(matcher.test('123')).toBe(false);
      expect(matcher.test(null)).toBe(false);
      expect(matcher.test(undefined)).toBe(false);
    });

    test('String name', () => {
      const matcher = any('Number');

      expect(matcher.test(0)).toBe(true);
      expect(matcher.test(123)).toBe(true);
      expect(matcher.test(-1)).toBe(true);
      expect(matcher.test(NaN)).toBe(true);
      expect(matcher.test('123')).toBe(false);
      expect(matcher.test(null)).toBe(false);
      expect(matcher.test(undefined)).toBe(false);
    });
  });

  describe('Boolean', () => {
    test('Constructor', () => {
      const matcher = any(Boolean);

      expect(matcher.test(true)).toBe(true);
      expect(matcher.test(false)).toBe(true);
      expect(matcher.test('true')).toBe(false);
      expect(matcher.test(1)).toBe(false);
      expect(matcher.test(null)).toBe(false);
    });

    test('String name', () => {
      const matcher = any('Boolean');

      expect(matcher.test(true)).toBe(true);
      expect(matcher.test(false)).toBe(true);
      expect(matcher.test('true')).toBe(false);
      expect(matcher.test(1)).toBe(false);
      expect(matcher.test(null)).toBe(false);
    });
  });

  describe('Array', () => {
    test('Constructor', () => {
      const matcher = any(Array);

      expect(matcher.test([])).toBe(true);
      expect(matcher.test([1, 2, 3])).toBe(true);
      expect(matcher.test({})).toBe(false);
      expect(matcher.test('[]')).toBe(false);
      expect(matcher.test(null)).toBe(false);
    });

    test('String name', () => {
      const matcher = any('Array');

      expect(matcher.test([])).toBe(true);
      expect(matcher.test([1, 2, 3])).toBe(true);
      expect(matcher.test({})).toBe(false);
      expect(matcher.test('[]')).toBe(false);
      expect(matcher.test(null)).toBe(false);
    });
  });

  describe('Object', () => {
    test('Constructor', () => {
      const matcher = any(Object);

      expect(matcher.test({})).toBe(true);
      expect(matcher.test({ a: 1 })).toBe(true);
      expect(matcher.test(new Date())).toBe(true);
      expect(matcher.test([])).toBe(false);
      expect(matcher.test(null)).toBe(false);
      expect(matcher.test('str')).toBe(false);
    });

    test('String name', () => {
      const matcher = any('Object');

      expect(matcher.test({})).toBe(true);
      expect(matcher.test({ a: 1 })).toBe(true);
      expect(matcher.test(new Date())).toBe(true);
      expect(matcher.test([])).toBe(false);
      expect(matcher.test(null)).toBe(false);
      expect(matcher.test('str')).toBe(false);
    });
  });
});
