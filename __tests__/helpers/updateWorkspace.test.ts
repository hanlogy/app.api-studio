import type { Workspace } from '@/definitions';
import { updateWorkspace } from '@/helpers/updateWorkspace';

const workspace: Pick<Workspace, 'collections' | 'environments'> = {
  environments: [
    {
      name: '@global',
      isGlobal: true,
      valuesMap: {
        token: '123',
      },
    },
  ],
  collections: [
    {
      name: 'collection_1',
      key: 'collection_1',
      id: 'collection_1',
      valuesMap: {
        isTrue: true,
      },
      requests: [
        {
          name: 'api_1',
          key: ['api_1', 'collection_1'],
          id: 'api_1',
          valuesMap: {
            limit: 10,
          },
        },
      ],
    },
  ],
};

describe('updateWorkspace', () => {
  test('empty', () => {
    const input = {
      environments: [],
      collections: [],
    };

    const result = updateWorkspace(input, 'requestVariable', {
      key: ['api_1', 'collection_1'],
      name: 'name',
      value: 'name-updated',
    });

    expect(result).toStrictEqual(input);
  });

  test('update requestVariable', () => {
    const result = updateWorkspace(workspace, 'requestVariable', {
      key: ['api_1', 'collection_1'],
      name: 'limit',
      value: 20,
    });

    expect(workspace).toStrictEqual({
      environments: expect.any(Array),
      collections: [
        {
          name: 'collection_1',
          key: 'collection_1',
          id: 'collection_1',
          valuesMap: {
            isTrue: true,
          },
          requests: [
            {
              name: 'api_1',
              key: ['api_1', 'collection_1'],
              id: 'api_1',
              valuesMap: {
                limit: 10,
              },
            },
          ],
        },
      ],
    });

    expect(result).toStrictEqual({
      environments: [
        {
          name: '@global',
          isGlobal: true,
          valuesMap: {
            token: '123',
          },
        },
      ],
      collections: [
        {
          name: 'collection_1',
          key: 'collection_1',
          id: 'collection_1',
          valuesMap: {
            isTrue: true,
          },
          requests: [
            {
              name: 'api_1',
              key: ['api_1', 'collection_1'],
              id: 'api_1',
              valuesMap: {
                limit: 20,
              },
            },
          ],
        },
      ],
    });
  });

  test('update collectionVariable', () => {
    const result = updateWorkspace(workspace, 'collectionVariable', {
      key: 'collection_1',
      name: 'isTrue',
      value: false,
    });

    expect(workspace).toStrictEqual({
      environments: expect.any(Array),
      collections: [
        {
          name: 'collection_1',
          key: 'collection_1',
          id: 'collection_1',
          valuesMap: {
            isTrue: true,
          },
          requests: expect.any(Array),
        },
      ],
    });

    expect(result).toStrictEqual({
      environments: expect.any(Array),
      collections: [
        {
          name: 'collection_1',
          key: 'collection_1',
          id: 'collection_1',
          valuesMap: {
            isTrue: false,
          },
          requests: expect.any(Array),
        },
      ],
    });
  });

  test('update environmentVariable', () => {
    const result = updateWorkspace(workspace, 'environmentVariable', {
      key: '@global',
      name: 'token',
      value: '456',
    });

    expect(workspace).toStrictEqual({
      environments: [
        {
          name: '@global',
          isGlobal: true,
          valuesMap: {
            token: '123',
          },
        },
      ],
      collections: expect.any(Array),
    });

    expect(result).toStrictEqual({
      environments: [
        {
          name: '@global',
          isGlobal: true,
          valuesMap: {
            token: '456',
          },
        },
      ],
      collections: expect.any(Array),
    });
  });
});
