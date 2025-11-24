import { isJsonRecord, isPrimitive } from '@/helpers/checkTypes';

describe('isPrimitive', () => {
  test('true', () => {
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
    expect(isPrimitive(0)).toBe(true);
    expect(isPrimitive('')).toBe(true);
  });

  test('false', () => {
    expect(isPrimitive(undefined)).toBe(false);
    expect(isPrimitive(() => {})).toBe(false);
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive([1])).toBe(false);
  });
});

describe('isJsonRecord', () => {
  test('undefined and primitives', () => {
    expect(isJsonRecord()).toBe(false);
    expect(isJsonRecord(null)).toBe(false);
    expect(isJsonRecord(true)).toBe(false);
    expect(isJsonRecord(false)).toBe(false);
    expect(isJsonRecord(1)).toBe(false);
    expect(isJsonRecord('hello')).toBe(false);
  });

  test('empty {}', () => {
    expect(isJsonRecord({})).toBe(true);
  });

  test('complex', () => {
    expect(
      isJsonRecord({
        a: 1,
        b: [1, 2, { c: true }],
        d: null,
      }),
    ).toBe(true);
  });
});

describe('isJsonValue', () => {});
