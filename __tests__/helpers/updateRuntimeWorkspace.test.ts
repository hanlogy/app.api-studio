import type { RuntimeWorkspace } from '@/definitions';
import { updateRuntimeWorkspace } from '@/helpers/updateRuntimeWorkspace';

const workspace: Pick<RuntimeWorkspace, 'collections' | 'environments'> = {
  environments: [
    {
      name: '@global',
      valuesMap: {
        token: '123',
      },
    },
  ],
  collections: [
    {
      key: 'collection_1',
      valuesMap: {
        isTrue: true,
      },
      requests: [
        {
          key: ['api_1', 'collection_1'],
          valuesMap: {
            limit: 10,
          },
        },
      ],
    },
  ],
};

describe('updateRuntimeWorkspace', () => {
  test('empty', () => {
    const input = {
      environments: [],
      collections: [],
    };

    const result = updateRuntimeWorkspace(input, 'requestVariable', {
      key: ['api_1', 'collection_1'],
      name: 'name',
      value: 'name-updated',
    });

    expect(result).toStrictEqual(input);
  });

  test('update requestVariable', () => {
    const result = updateRuntimeWorkspace(workspace, 'requestVariable', {
      key: ['api_1', 'collection_1'],
      name: 'limit',
      value: 20,
    });

    expect(workspace).toStrictEqual({
      environments: expect.any(Array),
      collections: [
        {
          key: 'collection_1',
          valuesMap: {
            isTrue: true,
          },
          requests: [
            {
              key: ['api_1', 'collection_1'],
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
          valuesMap: {
            token: '123',
          },
        },
      ],
      collections: [
        {
          key: 'collection_1',
          valuesMap: {
            isTrue: true,
          },
          requests: [
            {
              key: ['api_1', 'collection_1'],
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
    const result = updateRuntimeWorkspace(workspace, 'collectionVariable', {
      key: 'collection_1',
      name: 'isTrue',
      value: false,
    });

    expect(workspace).toStrictEqual({
      environments: expect.any(Array),
      collections: [
        {
          key: 'collection_1',
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
          key: 'collection_1',
          valuesMap: {
            isTrue: false,
          },
          requests: expect.any(Array),
        },
      ],
    });
  });

  test('update environmentVariable', () => {
    const result = updateRuntimeWorkspace(workspace, 'environmentVariable', {
      key: '@global',
      name: 'token',
      value: '456',
    });

    expect(workspace).toStrictEqual({
      environments: [
        {
          name: '@global',
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
          valuesMap: {
            token: '456',
          },
        },
      ],
      collections: expect.any(Array),
    });
  });
});
