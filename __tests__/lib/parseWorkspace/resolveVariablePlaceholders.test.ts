import {resolveVariablePlaceholders} from '@/lib/parseWorkspace/resolveVariablePlaceholders';

describe('resolveVariablePlaceholders', () => {
  test('not match', () => {
    expect(resolveVariablePlaceholders('hello', {})).toBe('hello');
  });

  test('string result', () => {
    expect(resolveVariablePlaceholders('level_{{level}}', {level: 100})).toBe(
      'level_100',
    );
  });

  test('number result', () => {
    expect(resolveVariablePlaceholders('{{level}}', {level: 100})).toBe(100);
  });

  test('null result', () => {
    expect(resolveVariablePlaceholders('{{address}}', {address: null})).toBe(
      null,
    );
  });

  test('boolean result', () => {
    expect(resolveVariablePlaceholders('{{closed}}', {closed: false})).toBe(
      false,
    );
  });

  test('multiple match', () => {
    expect(
      resolveVariablePlaceholders('{{name}}_{{level}}', {
        name: 'foo',
        level: 100,
      }),
    ).toBe('foo_100');
  });

  test('white spaces tolerance and trimming', () => {
    expect(
      resolveVariablePlaceholders('   {{ name  }}_{{ level  }} ', {
        name: 'foo',
        level: 100,
      }),
    ).toBe('foo_100');
  });
});
