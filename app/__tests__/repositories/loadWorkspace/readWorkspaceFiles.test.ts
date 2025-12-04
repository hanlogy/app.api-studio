import {
  WORKSPACE_COLLECTIONS_DIR,
  WORKSPACE_SERVERS_DIR,
  type JsonRecord,
} from '@/definitions';
import { readJsonRecord, readPlainText } from '@/helpers/fileIO';
import { readWorkspaceFiles } from '@/repositories/loadWorkspace/readWorkspaceFiles';

jest.mock('@/helpers/fileIO', () => ({
  readJsonRecord: jest.fn(),
  readPlainText: jest.fn(),
}));

const mockReadJson = readJsonRecord as jest.MockedFunction<
  typeof readJsonRecord
>;

const mockPlainText = readPlainText as jest.MockedFunction<
  typeof readPlainText
>;

const mockWorkspace = ({
  collections = {},
  servers = {},
}: {
  collections?: Record<string, string | JsonRecord>;
  servers?: Record<string, JsonRecord>;
}) => {
  const isCollectionsDir = (dir?: string) =>
    !!dir && dir.endsWith(`/${WORKSPACE_COLLECTIONS_DIR}`);
  const isServersDir = (dir?: string) =>
    !!dir && dir.endsWith(`/${WORKSPACE_SERVERS_DIR}`);

  mockPlainText.mockImplementation(({ file }) => {
    if (file in collections) {
      const value = collections[file];
      if (typeof value !== 'string') {
        throw new Error('never');
      }
      return Promise.resolve(value);
    }

    return Promise.resolve(null);
  });

  mockReadJson.mockImplementation(({ dir, file }) => {
    if (file === 'config.json') {
      return Promise.resolve({ name: 'workspace' });
    }

    if (isCollectionsDir(dir) && file in collections) {
      const value = collections[file];
      if (typeof value === 'string') {
        throw new Error('never');
      }
      return Promise.resolve(value);
    }

    if (isServersDir(dir) && file in servers) {
      return Promise.resolve(servers[file]);
    }

    return Promise.resolve(null);
  });
};

describe('readWorkspaceFiles', () => {
  beforeEach(() => {
    mockPlainText.mockReset();
    mockReadJson.mockReset();
  });

  it('one', async () => {
    const mockCollections = {
      'user.json': { name: 'user collection' },
      'profile/profile.json': {
        name: 'profile collection',
        requests: [{ name: 'delete profile' }],
      },
      'profile/getProfile.json': { name: 'getProfile request' },
      'profile/createProfile/createProfile.json': {
        name: 'createProfile request',
      },
      'profile/createProfile/createProfile.md': 'doc',
    };

    const mockServers = {
      'auth.json': { name: 'auth server' },
      'article/article.json': {
        name: 'article server',
        routes: [{ name: 'delete article' }],
      },
      'article/saveArticle.json': { name: 'save article' },
    };

    mockWorkspace({ collections: mockCollections, servers: mockServers });

    const result = await readWorkspaceFiles({
      dir: '/root/workspace',
      files: {
        config: 'config.json',
        collections: Object.keys(mockCollections),
        servers: Object.keys(mockServers),
      },
    });

    expect(result).toStrictEqual({
      config: {
        name: 'workspace',
      },
      collections: [
        {
          name: 'user collection',
          requests: [],
        },
        {
          name: 'profile collection',
          requests: [
            {
              name: 'delete profile',
            },
            {
              name: 'getProfile request',
            },
            {
              name: 'createProfile request',
              doc: 'doc',
            },
          ],
        },
      ],
      servers: [
        {
          name: 'auth server',
          routes: [],
        },
        {
          name: 'article server',
          routes: [
            {
              name: 'delete article',
            },
            {
              name: 'save article',
            },
          ],
        },
      ],
    });
  });
});
