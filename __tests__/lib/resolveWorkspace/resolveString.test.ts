import { resolveString } from '@/lib/resolveWorkspace/resolveString';

describe('resolveString', () => {
  test('return undefined', () => {
    expect(resolveString({ source: { level: 100 } })).toBeUndefined();
    expect(resolveString({ source: true })).toBeUndefined();
    expect(resolveString({ source: false })).toBeUndefined();
  });

  test('source is a number', () => {
    expect(resolveString({ source: 0 })).toBe(0);
    expect(resolveString({ source: 100 })).toBe(100);
  });

  test('source is an empty string', () => {
    expect(resolveString({ source: '' })).toBe('');
  });

  test('not match', () => {
    const result = resolveString({
      source: 'hello',
    });

    expect(result).toBe('hello');
  });

  test('string result', () => {
    const result = resolveString({
      source: 'level_{{level}}',
      valuesMap: { level: 100 },
    });

    expect(result).toBe('level_100');
  });

  test('number result', () => {
    const result = resolveString({
      source: '{{level}}',
      valuesMap: { level: 100 },
    });

    expect(result).toBe(100);
  });

  test('null result', () => {
    const result = resolveString({
      source: '{{address}}',
      valuesMap: { address: null },
    });

    expect(result).toBe(null);
  });

  test('boolean result', () => {
    const result = resolveString({
      source: '{{closed}}',
      valuesMap: { closed: false },
    });

    expect(result).toBe(false);
  });

  test('multiple match', () => {
    const result = resolveString({
      source: '{{name}}_{{level}}',
      valuesMap: {
        name: 'foo',
        level: 100,
      },
    });

    expect(result).toBe('foo_100');
  });

  test('white spaces tolerance and trimming', () => {
    const result = resolveString({
      source: '   {{ name  }}_{{ level  }} ',
      valuesMap: {
        name: 'foo',
        level: 100,
      },
    });
    expect(result).toBe('foo_100');
  });

  test('use lookup', () => {
    const result = resolveString({
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
