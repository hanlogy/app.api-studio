import { parseMatcher } from '@/lib/matcher/parseMatcher';

describe('parseMatcher', () => {
  test('invalid input', () => {
    expect(parseMatcher('foo')).toBeNull();
    expect(parseMatcher(' {{ not-a-matcher ')).toBeNull();
    expect(parseMatcher('{{anything}}')).toBeNull();
    expect(parseMatcher('{{ any }}')).toBeNull();
  });

  test('unknown matcher names', () => {
    expect(parseMatcher('{{unknown()}}')).toBeNull();
  });

  describe('anything', () => {
    test('without args', () => {
      const matcher = parseMatcher('{{anything()}}');
      expect(matcher?.name).toBe('anything');
    });

    test('with args', () => {
      expect(parseMatcher('{{anything("Foo")}}')).toBeNull();
    });
  });

  describe('any', () => {
    test('with args', () => {
      const matcher = parseMatcher('{{any( String )}}');
      expect(matcher?.name).toBe('any');
    });

    test('without args', () => {
      expect(parseMatcher('{{any( )}}')).toBeNull();
    });

    test('too many args', () => {
      expect(parseMatcher('{{any(String, Number)}}')).toBeNull();
    });
  });

  describe('stringContaining', () => {
    test('with args', () => {
      const matcher = parseMatcher('{{stringContaining("foo")}}');
      expect(matcher?.name).toBe('stringContaining');
    });

    test('without args', () => {
      expect(parseMatcher('{{stringContaining()}}')).toBeNull();
    });

    test('too many args', () => {
      expect(parseMatcher('{{stringContaining("1", "2")}}')).toBeNull();
    });

    test('invalid arg', () => {
      expect(parseMatcher('{{stringContaining(foo)}}')).toBeNull();
    });
  });

  describe('stringMatching', () => {
    test('with args', () => {
      const matcher = parseMatcher('{{stringMatching(/foo/)}}');
      expect(matcher?.name).toBe('stringMatching');
    });

    test('without args', () => {
      expect(parseMatcher('{{stringMatching()}}')).toBeNull();
    });

    test('too many args', () => {
      expect(parseMatcher('{{stringMatching(/a/, /b/)}}')).toBeNull();
    });

    test('invalid arg', () => {
      expect(parseMatcher('{{stringMatching("foo")}}')).toBeNull();
      expect(parseMatcher('{{stringMatching("/foo/")}}')).toBeNull();
    });
  });
});
