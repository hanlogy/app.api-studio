import {resolvePrimitiveRecord} from '@/lib/parseWorkspace/resolvePrimitiveRecord';

describe('resolvePrimitiveRecord', () => {
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
