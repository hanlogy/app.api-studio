import { resolveCollection } from '@/lib/resolveWorkspace/resolveCollection';

describe('resolveCollection', () => {
  test('invalid source', () => {
    expect(
      resolveCollection({ source: null, accumulateIds: [] }),
    ).toBeUndefined();
  });

  test('empty input', () => {
    expect(
      resolveCollection({ source: {}, accumulateIds: [] }),
    ).toBeUndefined();
  });

  test('with everything', () => {
    expect(
      resolveCollection({
        accumulateIds: [],
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
      order: expect.any(Number),
      key: expect.any(String),
      id: 'my_collection',
      name: 'My Collection',
      description: 'Test app',
      baseUrl: 'https://api.dev',
      headers: { ping: 'foo' },
      valuesMap: {
        name: 'foo',
      },
      requests: [
        {
          order: expect.any(Number),
          key: expect.any(Array),
          id: 'request_1',
          name: 'request-1',
          method: 'POST',
          url: 'https://api.dev/api?limit=10',
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
