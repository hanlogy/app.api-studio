import { resolveApiResource } from '@/lib/resolveWorkspace/resolveApiResource';

describe('resolveApiResource', () => {
  test('invalid source', () => {
    expect(resolveApiResource({ source: null })).toBeUndefined();
  });

  test('empty', () => {
    expect(
      resolveApiResource({
        source: {},
      }),
    ).toStrictEqual({
      key: expect.any(String),
    });
  });

  test('with everything', () => {
    expect(
      resolveApiResource({
        source: {
          name: 'api-1',
          method: 'POST',
          url: 'api',
          ':lastName': 'bar',
          query: { limit: '{{limit}}' },
          body: {
            firstName: '{{name}}',
            lastName: '{{lastName}}',
          },
        },
        valuesMap: {
          name: 'foo',
          limit: 10,
        },
      }),
    ).toStrictEqual({
      key: expect.stringMatching(/^TEMPORARY_API_ID_/),
      name: 'api-1',
      method: 'POST',
      url: 'api',
      query: { limit: '10' },
      body: {
        firstName: 'foo',
        lastName: 'bar',
      },
      valuesMap: {
        lastName: 'bar',
      },
    });
  });
});
