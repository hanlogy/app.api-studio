import type { Workspace } from '@/definitions';
import { findRequestFromWorkspace } from '@/helpers/findRequestFromWorkspace';

const workspace: Workspace = {
  name: 'workspace',
  dir: '/tmp',
  environments: [
    {
      isGlobal: true,
      name: '@global',
      headers: { a: '1' },
      valuesMap: { name: 'bar' },
    },
    {
      isGlobal: false,
      name: 'dev',
      headers: { b: '2' },
      valuesMap: { name: '2' },
    },
  ],
  collections: [
    {
      name: 'foo',
      key: 'foo',
      id: 'foo',
      headers: { c: '3' },
      valuesMap: { name: '3' },
      baseUrl: 'base',
      requests: [
        {
          name: 'api',
          id: 'api',
          key: ['api', 'foo'],
        },
      ],
    },
  ],
};

describe('findRequestFromWorkspace', () => {
  test('empty collections', () => {
    expect(
      findRequestFromWorkspace({
        name: '',
        dir: '',
        environments: [],
        collections: [],
      }),
    ).toBe(undefined);
  });

  test('undefined key', () => {
    expect(
      findRequestFromWorkspace({
        name: 'workspace',
        dir: '/tmp',
        environments: [],
        collections: [
          {
            name: 'foo',
            key: 'foo',
            id: 'foo',
            requests: [
              {
                name: 'api',
                id: 'api',
                key: ['api', 'foo'],
              },
            ],
          },
        ],
      }),
    ).toBe(undefined);
  });

  test('all good', () => {
    expect(
      findRequestFromWorkspace(workspace, {
        key: ['api', 'foo'],
        environmentName: 'dev',
      }),
    ).toStrictEqual({
      name: 'api',
      id: 'api',
      key: ['api', 'foo'],
      collection: {
        name: 'foo',
        headers: { c: '3' },
        valuesMap: { name: '3' },
        baseUrl: 'base',
      },
      environments: [
        {
          isGlobal: true,
          name: '@global',
          headers: { a: '1' },
          valuesMap: { name: 'bar' },
        },
        {
          isGlobal: false,
          name: 'dev',
          headers: { b: '2' },
          valuesMap: { name: '2' },
        },
      ],
    });
  });
});
