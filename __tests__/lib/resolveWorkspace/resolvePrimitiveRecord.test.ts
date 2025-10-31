import {resolvePrimitiveRecord} from '@/lib/resolveWorkspace/resolvePrimitiveRecord';

describe('resolvePrimitiveRecord', () => {
  test('return undefined', () => {
    expect(resolvePrimitiveRecord({source: null})).toBeUndefined();
    expect(resolvePrimitiveRecord({source: true})).toBeUndefined();
    expect(resolvePrimitiveRecord({source: 10})).toBeUndefined();
    expect(resolvePrimitiveRecord({source: true})).toBeUndefined();
    expect(resolvePrimitiveRecord({source: false})).toBeUndefined();
  });

  test('empty', () => {
    expect(resolvePrimitiveRecord({source: {}})).toStrictEqual({});
  });

  test('ignore undefined', () => {
    const result = resolvePrimitiveRecord({
      source: {name: 'foo', b: undefined} as any,
    });

    expect(result).toEqual({name: 'foo'});
  });

  test('result a string record', () => {
    const result = resolvePrimitiveRecord({
      source: {
        level: '{{level}}',
      },
      valuesMap: {
        level: 10,
      },
      transform: String,
    });

    expect(result).toStrictEqual({
      level: '10',
    });
  });
});
