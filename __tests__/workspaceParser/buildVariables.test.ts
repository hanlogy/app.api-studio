import {buildVariables} from '@/workspaceParser/buildVariables';

describe('buildVariables', () => {
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
