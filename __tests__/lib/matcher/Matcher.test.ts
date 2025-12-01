import { isMatcher, MATCHER } from '@/lib/matcher/Matcher';

describe('Matcher', () => {
  describe('isMatcher', () => {
    test('a valid Matcher', () => {
      expect(
        isMatcher({
          $$typeof: MATCHER,
          name: 'any',
          test: jest.fn(),
        }),
      ).toBe(true);
    });

    test('not a valid Matcher', () => {
      expect(isMatcher(null)).toBe(false);
      expect(isMatcher(undefined)).toBe(false);
      expect(isMatcher('string')).toBe(false);
      expect(isMatcher(123)).toBe(false);
      expect(isMatcher(true)).toBe(false);
    });

    test('$$typeof is missing', () => {
      expect(
        isMatcher({
          name: 'any',
          test: jest.fn(),
        }),
      ).toBe(false);
    });

    test('$$typeof is not the MATCHER symbol', () => {
      expect(
        isMatcher({
          $$typeof: Symbol('mock.matcher'),
          name: 'any',
          test: jest.fn(),
        }),
      ).toBe(false);
    });

    test('test is missing', () => {
      expect(
        isMatcher({
          $$typeof: MATCHER,
          name: 'any',
        }),
      ).toBe(false);
    });

    test('test is not a function', () => {
      expect(
        isMatcher({
          $$typeof: MATCHER,
          name: 'any',
          test: 123,
        }),
      ).toBe(false);
    });

    test('name is not a string', () => {
      expect(
        isMatcher({
          $$typeof: MATCHER,
          name: 123,
          test: jest.fn(),
        }),
      ).toBe(false);
    });
  });
});
