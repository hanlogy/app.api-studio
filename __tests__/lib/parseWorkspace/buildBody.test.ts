import {buildBody} from '@/lib/parseWorkspace/buildBody';

describe('buildBody', () => {
  test('primitive type body', () => {
    expect(buildBody(null)).toBeNull();
    expect(buildBody(1)).toBe(1);
    expect(buildBody(true)).toBe(true);
    expect(buildBody('foo')).toBe('foo');
  });

  test('primitive values from variables', () => {
    expect(buildBody('{{body}}', {body: null})).toBeNull();
    expect(buildBody('{{body}}', {body: 1})).toBe(1);
    expect(buildBody('{{body}}', {body: true})).toBe(true);
    expect(buildBody('{{body}}', {body: 'foo'})).toBe('foo');
  });

  test('json body', () => {
    const result = buildBody(
      {
        name: 'foo',
        value: '{{value}}',
      },
      {
        value: 100,
      },
    );

    expect(buildBody(result)).toStrictEqual({
      name: 'foo',
      value: 100,
    });
  });

  test('nested json body', () => {
    const result = buildBody(
      {
        name: {
          firtName: 'foo',
          lastName: '{{lastName}}',
        },
        values: ['{{value1}}', '{{value2}}'],
      },
      {
        value1: 100,
        value2: '200',
        lastName: 'baz',
      },
    );

    expect(result).toStrictEqual({
      name: {
        firtName: 'foo',
        lastName: 'baz',
      },
      values: [100, '200'],
    });
  });
});
