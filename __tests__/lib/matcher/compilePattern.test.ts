import { compilePattern } from '@/lib/matcher/compilePattern';
import type { Matcher } from '@/lib/matcher/definitions';
import { anything } from '@/lib/matcher/matchers/anything';

describe('compilePattern', () => {
  describe('primitives', () => {
    test('string', () => {
      const compiled = compilePattern('foo');
      expect(compiled).toBe('foo');
    });

    test('numbers', () => {
      const compiled = compilePattern(123);
      expect(compiled).toBe(123);
    });

    test('boolean', () => {
      expect(compilePattern(true)).toBe(true);
      expect(compilePattern(false)).toBe(false);
    });

    test('null', () => {
      expect(compilePattern(null)).toBeNull();
    });
  });

  describe('matchers', () => {
    test('anything', () => {
      const compiled = compilePattern('{{anything()}}') as Matcher;
      expect(compiled.name).toBe('anything');
    });

    test('any', () => {
      const compiled = compilePattern('{{any(String)}}') as Matcher;
      expect(compiled.name).toBe('any');
    });

    test('unknown matcher', () => {
      const raw = '{{unknownMatcher(foo)}}';
      const compiled = compilePattern(raw);
      expect(compiled).toBe(raw);
    });
  });

  test('input is a Matcher', () => {
    const matcher = anything();
    const compiled = compilePattern(matcher);
    // Same reference
    expect(compiled).toBe(matcher);
  });

  describe('arrays', () => {
    test('compiles each element in array', () => {
      const compiled = compilePattern([
        'foo',
        '{{anything()}}',
        123,
      ]) as unknown[];

      expect(compiled).toHaveLength(3);
      expect(compiled[0]).toBe('foo');
      expect((compiled[1] as Matcher).name).toBe('anything');
      expect(compiled[2]).toBe(123);
    });

    test('nested arrays', () => {
      const compiled = compilePattern([['{{anything()}}', 'x']]) as unknown[][];
      expect(compiled).toHaveLength(1);

      const inner = compiled[0];
      expect(inner[1]).toBe('x');
    });
  });

  describe('objects', () => {
    test('compiles each property value', () => {
      const raw = {
        name: '{{anything()}}',
        level: 100,
        meta: {
          tag: '{{any(String)}}',
        },
      };

      const compiled = compilePattern(raw) as Record<string, unknown>;

      const nameMatcher = compiled.name as Matcher;
      expect(nameMatcher.name).toBe('anything');

      expect(compiled.meta && typeof compiled.meta === 'object').toBe(true);
      const meta = compiled.meta as Record<string, unknown>;
      const tagMatcher = meta.tag as Matcher;
      expect(tagMatcher.name).toBe('any');
    });

    test('empty object remains empty object', () => {
      const compiled = compilePattern({});

      expect(compiled).toEqual({});
    });
  });

  describe('errors', () => {
    test('throws on functions', () => {
      expect(() => compilePattern(jest.fn as any)).toThrow();
    });

    test('throws on symbols', () => {
      expect(() => compilePattern(Symbol('x') as any)).toThrow();
    });
  });
});
