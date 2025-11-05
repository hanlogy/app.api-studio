import { resolveCollectionResource } from '@/lib/resolveWorkspace/resolveCollectionResource';

describe('resolveCollectionResource', () => {
  test('invalid source', () => {
    expect(resolveCollectionResource({ source: null })).toBeUndefined();
  });

  test('empty input', () => {
    expect(resolveCollectionResource({ source: {} })).toStrictEqual({
      key: expect.any(String),
      requests: [],
    });
  });

  test('with everything', () => {
    expect(
      resolveCollectionResource({
        source: {
          name: 'My Collection',
          description: 'Test app',
          baseUrl: '{{host}}',
          ':name': 'foo',
          headers: { ping: '{{name}}' },
          requests: [
            {
              name: 'request-1',
              method: 'POST',
              url: 'api',
              ':lastName': 'bar',
              ':name': 'foo-1',
              query: { limit: 10 },
              body: {
                firstName: '{{name}}',
                lastName: '{{lastName}}',
                level: '{{level}}',
              },
            },
          ],
        },
        valuesMap: {
          host: 'https://api.dev',
          level: 10,
        },
      }),
    ).toStrictEqual({
      key: expect.any(String),
      name: 'My Collection',
      description: 'Test app',
      baseUrl: 'https://api.dev',
      headers: { ping: 'foo' },
      valuesMap: {
        name: 'foo',
      },
      requests: [
        {
          key: expect.any(Array),
          name: 'request-1',
          method: 'POST',
          url: 'api',
          query: { limit: '10' },
          body: {
            firstName: 'foo-1',
            lastName: 'bar',
            level: 10,
          },
          valuesMap: {
            name: 'foo-1',
            lastName: 'bar',
          },
        },
      ],
    });
  });
});
