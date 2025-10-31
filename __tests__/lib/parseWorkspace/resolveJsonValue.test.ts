import {resolveJsonValue} from '@/lib/parseWorkspace/resolveJsonValue';

describe('resolveJsonValue', () => {
  test('undefined', () => {
    expect(resolveJsonValue({source: undefined} as any)).toBeUndefined();
    expect(resolveJsonValue(undefined as any)).toBeUndefined();
  });

  test('primitive type body', () => {
    expect(resolveJsonValue({source: null})).toBeNull();
    expect(resolveJsonValue({source: 1})).toBe(1);
    expect(resolveJsonValue({source: true})).toBe(true);
    expect(resolveJsonValue({source: 'foo'})).toBe('foo');
  });

  test('primitive values from variables', () => {
    expect(
      resolveJsonValue({
        source: '{{body}}',
        valuesMap: {body: null},
      }),
    ).toBeNull();

    expect(
      resolveJsonValue({
        source: '{{body}}',
        valuesMap: {body: 1},
      }),
    ).toBe(1);

    expect(
      resolveJsonValue({
        source: '{{body}}',
        valuesMap: {body: true},
      }),
    ).toBe(true);

    expect(
      resolveJsonValue({
        source: '{{body}}',
        valuesMap: {body: 'foo'},
      }),
    ).toBe('foo');
  });

  test('json body', () => {
    const result = resolveJsonValue({
      source: {
        name: 'foo',
        value: '{{value}}',
      },
      valuesMap: {
        value: 100,
      },
    });

    expect(result).toStrictEqual({
      name: 'foo',
      value: 100,
    });
  });

  test('nested json body', () => {
    const result = resolveJsonValue({
      source: {
        name: {
          firtName: 'foo',
          lastName: '{{lastName}}',
        },
        values: ['{{value1}}', '{{value2}}'],
      },
      valuesMap: {
        value1: 100,
        value2: '200',
        lastName: 'baz',
      },
    });

    expect(result).toStrictEqual({
      name: {
        firtName: 'foo',
        lastName: 'baz',
      },
      values: [100, '200'],
    });
  });

  test('handle undefined in json, the same behavior as JSON.stringify', () => {
    const result = resolveJsonValue({
      source: {
        name: undefined,
        values: [undefined],
      } as any,
    });

    expect(result).toStrictEqual({
      values: [null],
    });
  });
});
