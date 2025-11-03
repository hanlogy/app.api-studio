import {resolveWorkspace} from '@/lib/resolveWorkspace/resolveWorkspace';

describe('resolveWorkspace', () => {
  test('invalid source', () => {
    expect(
      resolveWorkspace({sources: {config: null, apis: []}}),
    ).toBeUndefined();
  });

  test('empty', () => {
    expect(resolveWorkspace({sources: {config: {}, apis: []}})).toStrictEqual({
      environments: [],
      apis: [],
    });
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
                headers: {name: 'foo'},
                ':limit': 10,
              },
              dev: {
                ':firstName': 'foo',
                ':host': 'https://dev.api',
              },
            },
          },
          apis: [
            {
              name: 'api-1',
              method: 'POST',
              url: '{{host}}/update',
              ':lastName': 'bar',
              query: {limit: '{{limit}}'},
              body: {
                firstName: '{{firstName}}',
                lastName: '{{lastName}}',
              },
            },
            {
              name: 'My Collection',
              description: 'Test app',
              baseUrl: '{{host}}/profile',
              headers: {ping: '{{firstName}}'},
              ':level': 8,
              ':lastName': 'bar',
              apis: [
                {
                  name: 'api-2',
                  method: 'POST',
                  url: 'update',
                  query: {limit: 10},
                  body: {
                    firstName: '{{firstName}}',
                    lastName: '{{lastName}}',
                    level: '{{level}}',
                  },
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
          headers: {name: 'foo'},
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
      apis: [
        {
          name: 'api-1',
          method: 'POST',
          url: 'https://dev.api/update',
          query: {limit: '10'},
          body: {
            firstName: 'foo',
            lastName: 'bar',
          },
          valuesMap: {
            lastName: 'bar',
          },
        },
        {
          name: 'My Collection',
          description: 'Test app',
          baseUrl: 'https://dev.api/profile',
          headers: {ping: 'foo'},
          valuesMap: {
            level: 8,
            lastName: 'bar',
          },
          apis: [
            {
              name: 'api-2',
              method: 'POST',
              url: 'update',
              query: {limit: '10'},
              body: {
                firstName: 'foo',
                lastName: 'bar',
                level: 8,
              },
            },
          ],
        },
      ],
    });
  });
});
