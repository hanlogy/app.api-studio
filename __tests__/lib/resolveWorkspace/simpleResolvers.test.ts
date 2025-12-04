import { resolveOrder } from '@/lib/resolveWorkspace/simpleResolvers';

describe('resolveOrder', () => {
  test('returns number if source is a number', () => {
    expect(resolveOrder(5)).toBe(5);
  });

  test('returns number if source is a numeric string', () => {
    expect(resolveOrder('42')).toBe(42);
  });

  test('returns MAX_SAFE_INTEGER if source is invalid and no name', () => {
    expect(resolveOrder('abc')).toBe(Number.MAX_SAFE_INTEGER);
    expect(resolveOrder(undefined)).toBe(Number.MAX_SAFE_INTEGER);
  });
});
