import { any } from '@/lib/matcher/matchers/any';
import { anything } from '@/lib/matcher/matchers/anything';
import { matchValue } from '@/lib/matcher/matchValue';

describe('matchValue', () => {
  describe('primitives', () => {
    test('number value', () => {
      const pattern = 100;
      expect(matchValue(100, pattern)).toBe(true);
      expect(matchValue(200, pattern)).toBe(false);
    });

    test('string value', () => {
      const pattern = 'foo';
      expect(matchValue('foo', pattern)).toBe(true);
      expect(matchValue('bar', pattern)).toBe(false);
    });

    test('null', () => {
      const pattern = null;
      expect(matchValue(null, pattern)).toBe(true);
      expect(matchValue(undefined, pattern)).toBe(false);
    });

    test('bool', () => {
      const pattern = true;
      expect(matchValue(true, pattern)).toBe(true);
      expect(matchValue(false, pattern)).toBe(false);
      expect(matchValue(null, pattern)).toBe(false);
    });
  });

  describe('matcher', () => {
    test('anything', () => {
      expect(matchValue('foo', anything())).toBe(true);
    });

    test('any', () => {
      expect(matchValue('foo', any(String))).toBe(true);
      expect(matchValue(true, any(Boolean))).toBe(true);
    });
  });

  describe('object pattern', () => {
    test('only checks specified keys and ignores extra keys', () => {
      const pattern = {
        name: any(String),
        level: 100,
      };

      const actual = {
        level: 100,
        name: 'Foo',
        age: 30,
      };

      expect(matchValue(actual, pattern)).toBe(true);
    });

    test('required key is missing', () => {
      const pattern = {
        name: any(String),
        level: 100,
      };

      const actual = {
        name: 'Foo',
        age: 30,
      };

      expect(matchValue(actual, pattern)).toBe(false);
    });

    test('does not mattch', () => {
      const pattern = {
        name: any(String),
        level: 100,
      };

      const actual = {
        name: 'Foo',
        level: 20,
      };

      expect(matchValue(actual, pattern)).toBe(false);
    });

    test('empty object pattern {} matches anything', () => {
      const pattern = {};

      expect(matchValue({ foo: 'bar' }, pattern)).toBe(true);
      expect(matchValue(123, pattern)).toBe(true);
      expect(matchValue(null, pattern)).toBe(true);
    });

    test('multiple nested structure', () => {
      const pattern = {
        user: {
          profile: {
            name: any(String),
          },
        },
      };

      const actual = {
        user: {
          profile: {
            name: 'Foo',
            age: 20,
          },
          role: 'admin',
        },
        meta: { version: 1 },
      };

      expect(matchValue(actual, pattern)).toBe(true);
    });
  });

  describe('array pattern', () => {
    test('empty [] matches any array', () => {
      const pattern = [] as any;

      expect(matchValue([], pattern)).toBe(true);
      expect(matchValue([1, 2, 3], pattern)).toBe(true);

      expect(matchValue('not array', pattern)).toBe(false);
    });

    test('only check the first element', () => {
      const pattern = [any(String)];

      expect(matchValue(['a'], pattern)).toBe(true);
      expect(matchValue(['a', 'b', 'c'], pattern)).toBe(true);
      expect(matchValue(['', 123], pattern)).toBe(true);

      expect(matchValue([], pattern)).toBe(false);
      expect(matchValue([123], pattern)).toBe(false);
    });

    test('match in order', () => {
      const pattern = [1, 2, any(String)];

      expect(matchValue([1, 2, 'a'], pattern)).toBe(true);
      expect(matchValue([1, 2, 'a', 3], pattern)).toBe(true);
      expect(matchValue([1, 'a'], pattern)).toBe(false);
      expect(matchValue([2, 1, 'a'], pattern)).toBe(false);
    });
  });
});
