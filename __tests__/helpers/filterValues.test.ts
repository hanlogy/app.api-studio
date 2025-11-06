import { pickWhenString, removeUndefined } from '@/helpers/filterValues';

describe('pickWhenString', () => {
  test('return undefined', () => {
    expect(pickWhenString(true)).toBeUndefined();
    expect(pickWhenString(false)).toBeUndefined();
    expect(pickWhenString(null)).toBeUndefined();
    expect(pickWhenString({})).toBeUndefined();
    expect(pickWhenString(['foo'])).toBeUndefined();
  });

  test('return string', () => {
    expect(pickWhenString('')).toBe('');
    expect(pickWhenString('foo')).toBe('foo');
  });
});

describe('removeUndefined', () => {
  test('all good', () => {
    expect(
      removeUndefined({
        a: false,
        b: undefined,
        c: null,
        d: 'd',
        e: [undefined],
      }),
    ).toStrictEqual({
      a: false,
      c: null,
      d: 'd',
      e: [undefined],
    });
  });
});
