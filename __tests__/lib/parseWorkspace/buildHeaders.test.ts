import {buildHeaders} from '@/lib/parseWorkspace/buildHeaders';

describe('buildHeaders', () => {
  test('undefined', () => {
    const result = buildHeaders();

    expect(result).toEqual({});
  });

  test('not a plain object', () => {
    const result = buildHeaders({source: 10});

    expect(result).toEqual({});
  });

  test('ignore undefined', () => {
    const result = buildHeaders({source: {name: 'foo', b: undefined}});

    expect(result).toEqual({name: 'foo'});
  });

  test('value is always string', () => {
    const result = buildHeaders({source: {name: true, total: 10}});

    expect(result).toEqual({name: 'true', total: '10'});
  });

  test('with variables', () => {
    const result = buildHeaders({
      source: {name: '{{name}}', total: 10},
      valuesMap: {name: true},
    });

    expect(result).toEqual({name: 'true', total: '10'});
  });
});
