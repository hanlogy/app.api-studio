import { isPrimitive } from '@/helpers/checkTypes';

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
