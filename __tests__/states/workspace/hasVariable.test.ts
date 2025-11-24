import type { Workspace } from '@/definitions';
import { hasVariable } from '@/states/workspace/hasVariable';

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

describe('hasVariable', () => {
  test('empty', () => {
    expect(
      hasVariable(
        {
          environments: [],
          collections: [],
        },
        {
          type: 'collection',
          key: 'none',
          name: 'none',
        },
      ),
    ).toBe(false);
  });

  test('environment true', () => {
    expect(
      hasVariable(workspace, {
        type: 'environment',
        key: '@global',
        name: 'token',
      }),
    ).toBe(true);
  });

  test('collection true', () => {
    expect(
      hasVariable(workspace, {
        type: 'collection',
        key: 'collection_1',
        name: 'isTrue',
      }),
    ).toBe(true);
  });

  test('request true', () => {
    expect(
      hasVariable(workspace, {
        type: 'request',
        key: ['api_1', 'collection_1'],
        name: 'limit',
      }),
    ).toBe(true);
  });
});
