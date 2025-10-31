import {pickDefinedString, removeUndefined} from '@/helpers/filterValues';

describe('pickDefinedString', () => {
  test('return undefined', () => {
    expect(pickDefinedString(true)).toBeUndefined();
    expect(pickDefinedString(false)).toBeUndefined();
    expect(pickDefinedString(null)).toBeUndefined();
    expect(pickDefinedString({})).toBeUndefined();
    expect(pickDefinedString(['foo'])).toBeUndefined();
  });

  test('return string', () => {
    expect(pickDefinedString('')).toBe('');
    expect(pickDefinedString('foo')).toBe('foo');
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
