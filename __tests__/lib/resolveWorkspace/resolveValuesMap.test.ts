import {resolveValuesMap} from '@/lib/resolveWorkspace/resolveValuesMap';

describe('resolveValuesMap', () => {
  test('return undefined', () => {
    expect(resolveValuesMap({source: true})).toEqual(undefined);
    expect(resolveValuesMap({source: 10})).toEqual(undefined);
  });

  describe('no internal variables', () => {
    test('empty', () => {
      expect(resolveValuesMap({source: {}})).toEqual({});
    });
  });

  describe('with internal variables', () => {
    test('success', () => {
      const result = resolveValuesMap({
        source: {
          ':firstName': 'foo',
          ':lastName': 'bar',
          ':fullName': '{{firstName}}-{{lastName}}',
          ':level': 1,
        },
      });

      expect(result).toEqual({
        firstName: 'foo',
        lastName: 'bar',
        fullName: 'foo-bar',
        level: 1,
      });
    });

    test('keep the placeholder if no match', () => {
      const result = resolveValuesMap({
        source: {
          ':lastName': 'bar',
          ':fullName': '{{firstName}}-{{lastName}}',
          ':level': 1,
        },
      });

      expect(result).toEqual({
        lastName: 'bar',
        fullName: '{{firstName}}-bar',
        level: 1,
      });
    });

    test('Recursive error', () => {
      expect(() => {
        resolveValuesMap({
          source: {
            ':firstName': '{{fullName}}',
            ':lastName': 'bar',
            ':fullName': '{{firstName}}-{{lastName}}',
            ':level': 1,
          },
        });
      }).toThrow(expect.objectContaining({code: 'recursiveReference'}));
    });
  });

  test('with external variables', () => {
    const result = resolveValuesMap({
      source: {
        ':lastName': 'bar',
        ':fullName': '{{firstName}}-{{lastName}}',
        ':level': 1,
      },
      valuesMap: {
        firstName: 'foo',
      },
    });
    expect(result).toEqual({
      lastName: 'bar',
      fullName: 'foo-bar',
      level: 1,
    });
  });

  test('the right priority', () => {
    const result = resolveValuesMap({
      source: {
        ':firstName': 'foo',
        ':lastName': 'bar',
        ':fullName': '{{firstName}}-{{lastName}}',
        ':level': 1,
      },
      valuesMap: {
        firstName: 'baz',
      },
    });
    expect(result).toEqual({
      firstName: 'foo',
      lastName: 'bar',
      fullName: 'foo-bar',
      level: 1,
    });
  });

  test('chained, the order does not matter', () => {
    const result = resolveValuesMap({
      source: {
        ':name2': '{{name1}}-2',
        ':name3': '{{name1}}-{{name2}}',
        ':name': 'foo',
        ':name1': '1-{{name}}',
      },
    });

    expect(result).toEqual({
      name2: '1-foo-2',
      name3: '1-foo-1-foo-2',
      name: 'foo',
      name1: '1-foo',
    });
  });

  test('keep the value types if possible', () => {
    const result = resolveValuesMap({
      source: {
        ':key1': '{{value1}}',
        ':key2': '{{value2}}',
        ':key3': '{{value3}}',
        ':key4': '{{value4}}',
        ':key5': '{{key4}}',
        ':key6': '{{key2}}-{{key3}}',
      },
      valuesMap: {
        value1: true,
        value2: false,
        value3: null,
        value4: 10,
      },
    });
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
