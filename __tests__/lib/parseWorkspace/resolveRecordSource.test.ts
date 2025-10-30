import {resolveRecordSource} from '@/lib/parseWorkspace/resolveRecordSource';

describe('resolveRecordSource', () => {
  test('empty', () => {
    const result = resolveRecordSource({
      source: {},
    });

    expect(result).toStrictEqual({});
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

    expect(result).toStrictEqual({});
  });
});
