import {resolveStringSource} from '@/lib/parseWorkspace/resolveStringSource';

describe('resolveStringSource', () => {
  test('not match', () => {
    const result = resolveStringSource({
      source: 'hello',
    });

    expect(result).toBe('hello');
  });

  test('string result', () => {
    const result = resolveStringSource({
      source: 'level_{{level}}',
      valuesMap: {level: 100},
    });

    expect(result).toBe('level_100');
  });

  test('number result', () => {
    const result = resolveStringSource({
      source: '{{level}}',
      valuesMap: {level: 100},
    });

    expect(result).toBe(100);
  });

  test('null result', () => {
    const result = resolveStringSource({
      source: '{{address}}',
      valuesMap: {address: null},
    });

    expect(result).toBe(null);
  });

  test('boolean result', () => {
    const result = resolveStringSource({
      source: '{{closed}}',
      valuesMap: {closed: false},
    });

    expect(result).toBe(false);
  });

  test('multiple match', () => {
    const result = resolveStringSource({
      source: '{{name}}_{{level}}',
      valuesMap: {
        name: 'foo',
        level: 100,
      },
    });

    expect(result).toBe('foo_100');
  });

  test('white spaces tolerance and trimming', () => {
    const result = resolveStringSource({
      source: '   {{ name  }}_{{ level  }} ',
      valuesMap: {
        name: 'foo',
        level: 100,
      },
    });
    expect(result).toBe('foo_100');
  });

  test('use lookup', () => {
    const result = resolveStringSource({
      source: '{{name}}_{{level}}',
      lookup: key => {
        switch (key) {
          case 'name':
            return 'foo';
          case 'level':
            return 100;
        }
      },
    });

    expect(result).toBe('foo_100');
  });
});
