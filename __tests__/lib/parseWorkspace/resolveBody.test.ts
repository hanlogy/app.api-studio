import {resolveBody} from '@/lib/parseWorkspace/resolveBody';

describe('resolveBody', () => {
  test('primitive type body', () => {
    expect(resolveBody({source: null})).toBeNull();
    expect(resolveBody({source: 1})).toBe(1);
    expect(resolveBody({source: true})).toBe(true);
    expect(resolveBody({source: 'foo'})).toBe('foo');
  });

  test('primitive values from variables', () => {
    expect(
      resolveBody({
        source: '{{body}}',
        valuesMap: {body: null},
      }),
    ).toBeNull();

    expect(
      resolveBody({
        source: '{{body}}',
        valuesMap: {body: 1},
      }),
    ).toBe(1);

    expect(
      resolveBody({
        source: '{{body}}',
        valuesMap: {body: true},
      }),
    ).toBe(true);

    expect(
      resolveBody({
        source: '{{body}}',
        valuesMap: {body: 'foo'},
      }),
    ).toBe('foo');
  });

  test('json body', () => {
    const result = resolveBody({
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
    const result = resolveBody({
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
});
