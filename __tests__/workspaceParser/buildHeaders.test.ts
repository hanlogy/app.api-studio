import {buildHeaders} from '@/repositories/workspace/buildHeaders';

describe('buildHeaders', () => {
  test('undefined', () => {
    const result = buildHeaders();

    expect(result).toEqual({});
  });

  test('not a plain object', () => {
    const result = buildHeaders(10);

    expect(result).toEqual({});
  });

  test('ignore undefined', () => {
    const result = buildHeaders({name: 'foo', b: undefined});

    expect(result).toEqual({name: 'foo'});
  });

  test('value is always string', () => {
    const result = buildHeaders({name: true, total: 10});

    expect(result).toEqual({name: 'true', total: '10'});
  });
});
