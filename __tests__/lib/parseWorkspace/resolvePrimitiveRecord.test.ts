import {resolvePrimitiveRecord} from '@/lib/parseWorkspace/resolvePrimitiveRecord';

describe('resolvePrimitiveRecord', () => {
  test('return empty', () => {
    expect(resolvePrimitiveRecord(undefined as any)).toStrictEqual({});
    expect(resolvePrimitiveRecord({source: undefined} as any)).toStrictEqual(
      {},
    );
    expect(resolvePrimitiveRecord({source: null} as any)).toStrictEqual({});
    expect(resolvePrimitiveRecord({source: true} as any)).toStrictEqual({});
    expect(resolvePrimitiveRecord({source: false} as any)).toStrictEqual({});
    expect(resolvePrimitiveRecord({source: 10} as any)).toStrictEqual({});
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
