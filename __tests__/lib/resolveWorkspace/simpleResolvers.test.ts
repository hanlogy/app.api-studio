import { resolvedOrder } from '@/lib/resolveWorkspace/simpleResolvers';

describe('resolvedOrder', () => {
  test('returns number if source is a number', () => {
    expect(resolvedOrder(5)).toBe(5);
  });

  test('returns number if source is a numeric string', () => {
    expect(resolvedOrder('42')).toBe(42);
  });

  test('returns MAX_SAFE_INTEGER if source is invalid and no name', () => {
    expect(resolvedOrder('abc')).toBe(Number.MAX_SAFE_INTEGER);
    expect(resolvedOrder(undefined)).toBe(Number.MAX_SAFE_INTEGER);
  });
});
