import { anything } from '@/lib/matcher/matchers/anything';

describe('anything', () => {
  test('matcher name', () => {
    expect(anything().name).toBe('anything');
  });

  test('undefined', () => {
    expect(anything().test()).toBe(false);
    expect(anything().test(undefined)).toBe(false);
  });

  test('null', () => {
    expect(anything().test(null)).toBe(false);
  });

  test('anything other than undefined, null', () => {
    expect(anything().test(1)).toBe(true);
    expect(anything().test(jest.fn())).toBe(true);
    expect(anything().test(false)).toBe(true);
    expect(anything().test('foo')).toBe(true);
    expect(anything().test(new Date())).toBe(true);
  });
});
