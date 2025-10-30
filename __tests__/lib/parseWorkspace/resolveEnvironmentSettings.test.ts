import {resolveEnvironmentSettings} from '@/lib/parseWorkspace/resolveEnvironmentSettings';

describe('resolveEnvironmentSettings', () => {
  test('both undefined', () => {
    const result = resolveEnvironmentSettings();
    expect(result).toStrictEqual({headers: {}, variables: {}});
  });

  test('no local name specified', () => {
    const result = resolveEnvironmentSettings([
      {isGlobal: true, variables: {name: 'foo'}},
      {name: 'dev', variables: {name: 'bar'}},
    ]);

    expect(result).toStrictEqual({headers: {}, variables: {name: 'foo'}});
  });
});
