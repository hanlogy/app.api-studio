import {resolveHeaders} from '@/lib/parseWorkspace/resolveHeaders';

describe('resolveHeaders', () => {
  test('return empty', () => {
    expect(resolveHeaders({source: {}})).toStrictEqual({});
    expect(resolveHeaders({source: undefined})).toStrictEqual({});
    expect(resolveHeaders({source: 10})).toStrictEqual({});
    expect(resolveHeaders({source: true})).toStrictEqual({});
    expect(resolveHeaders({source: null})).toStrictEqual({});
  });

  test('ignore undefined', () => {
    const result = resolveHeaders({source: {name: 'foo', b: undefined}});

    expect(result).toEqual({name: 'foo'});
  });

  test('value is always string', () => {
    const result = resolveHeaders({source: {name: true, total: 10}});

    expect(result).toEqual({name: 'true', total: '10'});
  });

  test('with variables', () => {
    const result = resolveHeaders({
      source: {name: '{{name}}', total: 10},
      valuesMap: {name: true},
    });

    expect(result).toEqual({name: 'true', total: '10'});
  });
});
