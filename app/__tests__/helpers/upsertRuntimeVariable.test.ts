import type { RuntimeWorkspace } from '@/definitions';
import { upsertRuntimeVariable } from '@/helpers/upsertRuntimeVariable';

describe('upsertRuntimeVariable: update', () => {
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

  test('update request variable', () => {
    const result = upsertRuntimeVariable(workspace, {
      type: 'request',
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

  test('update collection variable', () => {
    const result = upsertRuntimeVariable(workspace, {
      type: 'collection',
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

  test('update environment variable', () => {
    const result = upsertRuntimeVariable(workspace, {
      type: 'environment',
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

describe('upsertRuntimeVariable: intert', () => {
  const workspace = {};

  test('insert environment variable', () => {
    const result = upsertRuntimeVariable(workspace, {
      type: 'environment',
      key: '@global',
      name: 'token',
      value: '456',
    });

    expect(workspace).toStrictEqual({});

    expect(result).toStrictEqual({
      environments: [
        {
          name: '@global',
          valuesMap: {
            token: '456',
          },
        },
      ],
    });
  });

  test('insert collection variable', () => {
    const result = upsertRuntimeVariable(workspace, {
      type: 'collection',
      key: 'collection_1',
      name: 'isTrue',
      value: false,
    });

    expect(workspace).toStrictEqual({});

    expect(result).toStrictEqual({
      collections: [
        {
          key: 'collection_1',
          valuesMap: {
            isTrue: false,
          },
        },
      ],
    });
  });

  test('insert request variable', () => {
    const result = upsertRuntimeVariable(workspace, {
      type: 'request',
      key: ['api_1', 'collection_1'],
      name: 'limit',
      value: 20,
    });

    expect(workspace).toStrictEqual({});

    expect(result).toStrictEqual({
      collections: [
        {
          key: 'collection_1',
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
});
