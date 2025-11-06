import { toSafeId } from '@/helpers/toSafeId';

describe('toSafeId', () => {
  test('1', () => {
    expect(toSafeId('___Café 1___')).toBe('cafe_1');
  });

  test('2', () => {
    expect(toSafeId('abc你好123')).toBe('abc_e4bda0_e5a5bd_123');
  });
});
