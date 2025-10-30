import {buildVariables} from '@/lib/parseWorkspace/buildVariables';

describe('buildVariables', () => {
  describe('no internal variables', () => {
    test('undefined', () => {
      const result = buildVariables();

      expect(result).toEqual({});
    });

    test('not a plain object', () => {
      const result = buildVariables(10);

      expect(result).toEqual({});
    });

    test('ignore undefined', () => {
      const result = buildVariables({':name': 'foo', b: undefined});

      expect(result).toEqual({name: 'foo'});
    });
  });

  describe('with internal variables', () => {
    test('success', () => {
      const result = buildVariables({
        ':firstName': 'foo',
        ':lastName': 'bar',
        ':fullName': '{{firstName}}-{{lastName}}',
        ':level': 1,
      });

      expect(result).toEqual({
        firstName: 'foo',
        lastName: 'bar',
        fullName: 'foo-bar',
        level: 1,
      });
    });

    test('keep the placeholder if no match', () => {
      const result = buildVariables({
        ':lastName': 'bar',
        ':fullName': '{{firstName}}-{{lastName}}',
        ':level': 1,
      });

      expect(result).toEqual({
        lastName: 'bar',
        fullName: '{{firstName}}-bar',
        level: 1,
      });
    });

    test('Recursive error', () => {
      expect(() => {
        buildVariables({
          ':firstName': '{{fullName}}',
          ':lastName': 'bar',
          ':fullName': '{{firstName}}-{{lastName}}',
          ':level': 1,
        });
      }).toThrow(expect.objectContaining({code: 'recursiveReference'}));
    });
  });

  test('with external variables', () => {
    const result = buildVariables(
      {
        ':lastName': 'bar',
        ':fullName': '{{firstName}}-{{lastName}}',
        ':level': 1,
      },
      {
        firstName: 'foo',
      },
    );
    expect(result).toEqual({
      lastName: 'bar',
      fullName: 'foo-bar',
      level: 1,
    });
  });

  test('the right priority', () => {
    const result = buildVariables(
      {
        ':firstName': 'foo',
        ':lastName': 'bar',
        ':fullName': '{{firstName}}-{{lastName}}',
        ':level': 1,
      },
      {
        firstName: 'baz',
      },
    );
    expect(result).toEqual({
      firstName: 'foo',
      lastName: 'bar',
      fullName: 'foo-bar',
      level: 1,
    });
  });

  test('chained, the order does not matter', () => {
    const result = buildVariables({
      ':name2': '{{name1}}-2',
      ':name3': '{{name1}}-{{name2}}',
      ':name': 'foo',
      ':name1': '1-{{name}}',
    });

    expect(result).toEqual({
      name2: '1-foo-2',
      name3: '1-foo-1-foo-2',
      name: 'foo',
      name1: '1-foo',
    });
  });

  test('keep the value types if possible', () => {
    const result = buildVariables(
      {
        ':key1': '{{value1}}',
        ':key2': '{{value2}}',
        ':key3': '{{value3}}',
        ':key4': '{{value4}}',
        ':key5': '{{key4}}',
        ':key6': '{{key2}}-{{key3}}',
      },
      {
        value1: true,
        value2: false,
        value3: null,
        value4: 10,
      },
    );
    expect(result).toStrictEqual({
      key1: true,
      key2: false,
      key3: null,
      key4: 10,
      key5: 10,
      key6: 'false-null',
    });
  });
});
