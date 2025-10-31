import {resolvePrimitiveRecordSource} from '@/lib/parseWorkspace/resolvePrimitiveRecordSource';

describe('resolvePrimitiveRecordSource', () => {
  test('return empty', () => {
    expect(resolvePrimitiveRecordSource(undefined as any)).toStrictEqual({});

    expect(
      resolvePrimitiveRecordSource({source: undefined} as any),
    ).toStrictEqual({});

    expect(resolvePrimitiveRecordSource({source: null} as any)).toStrictEqual(
      {},
    );

    expect(resolvePrimitiveRecordSource({source: true} as any)).toStrictEqual(
      {},
    );

    expect(resolvePrimitiveRecordSource({source: false} as any)).toStrictEqual(
      {},
    );

    expect(resolvePrimitiveRecordSource({source: 10} as any)).toStrictEqual({});

    expect(resolvePrimitiveRecordSource({source: {}})).toStrictEqual({});
  });

  test('ignore undefined', () => {
    const result = resolvePrimitiveRecordSource({
      source: {name: 'foo', b: undefined} as any,
    });

    expect(result).toEqual({name: 'foo'});
  });

  test('result a string record', () => {
    const result = resolvePrimitiveRecordSource({
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
