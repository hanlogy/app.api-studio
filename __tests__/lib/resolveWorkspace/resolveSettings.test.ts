import { resolveSettings } from '@/lib/resolveWorkspace/resolveSettings';

describe('resolveSettings', () => {
  test('invalid source', () => {
    expect(resolveSettings({ source: null })).toBeUndefined();
  });

  test('empty input', () => {
    expect(resolveSettings({ source: {} })).toStrictEqual({ environments: [] });
  });

  test('with everything', () => {
    expect(
      resolveSettings({
        source: {
          name: 'foo',
          description: 'bar',
          environments: {
            '@global': {
              headers: { name: 'foo' },
            },
            dev: { ':api': 'https://dev.api' },
          },
        },
      }),
    ).toStrictEqual({
      name: 'foo',
      description: 'bar',
      environments: [
        {
          isGlobal: true,
          name: '@global',
          headers: {
            name: 'foo',
          },
        },
        {
          isGlobal: false,
          name: 'dev',
          valuesMap: {
            api: 'https://dev.api',
          },
        },
      ],
    });
  });
});
