import {resolveRecordSource} from '@/lib/parseWorkspace/resolveRecordSource';

describe('resolveRecordSource', () => {
  test('return empty', () => {
    expect(resolveRecordSource()).toStrictEqual({});
    expect(resolveRecordSource({source: undefined} as any)).toStrictEqual({});
    expect(resolveRecordSource({source: null} as any)).toStrictEqual({});
    expect(resolveRecordSource({source: true} as any)).toStrictEqual({});
    expect(resolveRecordSource({source: false} as any)).toStrictEqual({});
    expect(resolveRecordSource({source: 10} as any)).toStrictEqual({});
    expect(resolveRecordSource({source: {}})).toStrictEqual({});
  });

  test('ignore undefined', () => {
    const result = resolveRecordSource({
      source: {name: 'foo', b: undefined} as any,
    });

    expect(result).toEqual({name: 'foo'});
  });

  test('result a string record', () => {
    const result = resolveRecordSource({
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
