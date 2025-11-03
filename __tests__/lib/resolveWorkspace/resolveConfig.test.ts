import { resolveConfig } from '@/lib/resolveWorkspace/resolveConfig';

describe('resolveApiResource', () => {
  test('invalid source', () => {
    expect(resolveConfig({ source: null })).toBeUndefined();
  });

  test('empty input', () => {
    expect(resolveConfig({ source: {} })).toStrictEqual({ environments: [] });
  });

  test('with everything', () => {
    expect(
      resolveConfig({
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
