import { resolveWorkspace } from '@/lib/resolveWorkspace/resolveWorkspace';

describe('resolveWorkspace', () => {
  test('invalid source', () => {
    expect(
      resolveWorkspace({
        sources: { config: null, collections: [], servers: [] },
      }),
    ).toBeUndefined();
  });

  test('empty input', () => {
    expect(
      resolveWorkspace({
        sources: { config: {}, collections: [], servers: [] },
      }),
    ).toBeUndefined();
  });

  test('almost with everything', () => {
    expect(
      resolveWorkspace({
        sources: {
          config: {
            name: 'workspace',
            description: 'bar',
            environments: {
              '@global': {
                headers: { name: 'foo' },
                ':limit': 10,
              },
              dev: {
                ':firstName': 'foo',
                ':host': 'https://dev.api',
              },
            },
          },
          collections: [
            {
              name: 'My Collection',
              description: 'Test app',
              baseUrl: '{{host}}/profile',
              headers: { ping: '{{firstName}}' },
              ':level': 8,
              ':lastName': 'bar',
              requests: [
                {
                  name: 'api-1',
                  method: 'POST',
                  url: 'update',
                  query: { limit: 10 },
                  body: {
                    firstName: '{{firstName}}',
                    lastName: '{{lastName}}',
                    level: '{{level}}',
                  },
                },
              ],
            },
          ],
          servers: [
            {
              name: 'My Server',
              port: 20,
              routes: [
                {
                  name: 'user',
                  method: 'ALL',
                  cases: [
                    {
                      forward: 'https://foo',
                    },
                  ],
                },
              ],
            },
          ],
        },
        environmentName: 'dev',
      }),
    ).toStrictEqual({
      name: 'workspace',
      description: 'bar',
      environments: [
        {
          isGlobal: true,
          name: '@global',
          headers: { name: 'foo' },
          valuesMap: {
            limit: 10,
          },
        },
        {
          isGlobal: false,
          name: 'dev',
          valuesMap: {
            firstName: 'foo',
            host: 'https://dev.api',
          },
        },
      ],
      collections: [
        {
          order: expect.any(Number),
          key: expect.any(String),
          id: 'my_collection',
          name: 'My Collection',
          description: 'Test app',
          baseUrl: 'https://dev.api/profile',
          headers: { ping: 'foo' },
          valuesMap: {
            level: 8,
            lastName: 'bar',
          },
          requests: [
            {
              order: expect.any(Number),
              key: expect.any(Array),
              id: 'api_1',
              name: 'api-1',
              method: 'POST',
              url: 'https://dev.api/profile/update?limit=10',
              query: { limit: '10' },
              body: {
                firstName: 'foo',
                lastName: 'bar',
                level: 8,
              },
            },
          ],
        },
      ],
      servers: [
        {
          name: 'My Server',
          order: expect.any(Number),
          port: 20,
          routes: [
            {
              name: 'user',
              method: 'ALL',
              order: expect.any(Number),
              path: '',
              cases: [
                {
                  forward: 'https://foo',
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
