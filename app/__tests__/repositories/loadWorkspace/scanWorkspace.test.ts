import { scanWorkspace } from '@/repositories/loadWorkspace/scanWorkspace';
import RNFS from 'react-native-fs';

jest.mock('react-native-fs', () => ({
  readDir: jest.fn(),
}));

const createItem = ({
  name,
  baseDir,
  isDir,
}: {
  name: string;
  baseDir: string;
  isDir: boolean;
}): Partial<RNFS.ReadDirItem> => ({
  name,
  path: `${baseDir}/${name}`,
  mtime: new Date(),
  isDirectory: () => isDir,
  isFile: () => !isDir,
});

type MockFS = Record<string, Partial<RNFS.ReadDirItem>[]>;

const file = ({ name, baseDir }: { name: string; baseDir: string }) =>
  createItem({ name, baseDir, isDir: false });

const dir = ({ name, baseDir }: { name: string; baseDir: string }) =>
  createItem({ name, baseDir, isDir: true });

function mockWorkspace(structure: MockFS) {
  const mockReadDir = RNFS.readDir as jest.Mock;

  mockReadDir.mockImplementation((path: string) => {
    if (path in structure) {
      return Promise.resolve(structure[path]);
    }

    return Promise.resolve([]);
  });
}

describe('scanWorkspace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('empty workspace', async () => {
    mockWorkspace({
      '/workspace': [],
    });

    const result = await scanWorkspace('/workspace');
    expect(result).toBeUndefined();
  });

  test('not a valid workspace', async () => {
    mockWorkspace({
      '/workspace': [
        file({ name: 'README.md', baseDir: '/workspace' }),
        dir({ name: 'collections', baseDir: '/workspace' }),
      ],
      '/workspace/collections': [
        file({ name: 'collections.json', baseDir: '/workspace/collections' }),
      ],
    });

    const result = await scanWorkspace('/workspace');
    expect(result).toBeUndefined();
  });

  test('only a config file', async () => {
    mockWorkspace({
      '/workspace': [file({ name: 'config.json', baseDir: '/workspace' })],
    });

    const result = await scanWorkspace('/workspace');
    expect(result).toStrictEqual({
      timestamps: { config: expect.any(Number), collections: {} },
      files: { config: 'config.json', collections: [] },
    });
  });

  test('no valid collections', async () => {
    mockWorkspace({
      '/workspace': [
        file({ name: 'config.json', baseDir: '/workspace' }),
        dir({ name: 'collections', baseDir: '/workspace' }),
      ],
      '/workspace/collections': [
        file({ name: 'test.md', baseDir: '/workspace/collections' }),
      ],
    });

    const result = await scanWorkspace('/workspace');
    expect(result).toStrictEqual({
      timestamps: { config: expect.any(Number), collections: {} },
      files: { config: 'config.json', collections: [] },
    });
  });

  test('valid collections', async () => {
    mockWorkspace({
      '/workspace': [
        file({ name: 'config.json', baseDir: '/workspace' }),
        dir({ name: 'collections', baseDir: '/workspace' }),
      ],
      '/workspace/collections': [
        file({ name: 'user.json', baseDir: '/workspace/collections' }),
        file({ name: 'profile.json', baseDir: '/workspace/collections' }),
        dir({ name: 'post', baseDir: '/workspace/collections' }),
      ],
    });

    const result = await scanWorkspace('/workspace');
    expect(result).toStrictEqual({
      timestamps: {
        config: expect.any(Number),
        collections: {
          'user.json': expect.any(Number),
          'profile.json': expect.any(Number),
        },
      },
      files: {
        config: 'config.json',
        collections: ['user.json', 'profile.json'],
      },
    });
  });

  describe('with description folder', () => {
    const baseStructure = {
      '/workspace': [
        file({ name: 'config.json', baseDir: '/workspace' }),
        dir({ name: 'collections', baseDir: '/workspace' }),
      ],
    };

    test('collection folder is ignored', async () => {
      mockWorkspace({
        ...baseStructure,
        '/workspace/collections': [
          file({ name: 'profile.json', baseDir: '/workspace/collections' }),
          file({ name: 'post.json', baseDir: '/workspace/collections' }),
          dir({ name: 'post', baseDir: '/workspace/collections' }),
        ],
        '/workspace/collections/post': [
          file({
            name: 'post.json',
            baseDir: '/workspace/collections/post',
          }),
          file({
            name: 'createPost.json',
            baseDir: '/workspace/collections/post',
          }),
        ],
      });

      const result = await scanWorkspace('/workspace');
      expect(result).toStrictEqual({
        timestamps: {
          config: expect.any(Number),
          collections: {
            'profile.json': expect.any(Number),
            'post.json': expect.any(Number),
          },
        },
        files: {
          config: 'config.json',
          collections: ['profile.json', 'post.json'],
        },
      });
    });

    test('valid collection folder', async () => {
      mockWorkspace({
        ...baseStructure,
        '/workspace/collections': [
          file({ name: 'profile.json', baseDir: '/workspace/collections' }),
          dir({ name: 'post', baseDir: '/workspace/collections' }),
        ],
        '/workspace/collections/post': [
          file({
            name: 'post.json',
            baseDir: '/workspace/collections/post',
          }),
          file({
            name: 'createPost.json',
            baseDir: '/workspace/collections/post',
          }),
        ],
      });

      const result = await scanWorkspace('/workspace');
      expect(result).toStrictEqual({
        timestamps: {
          config: expect.any(Number),
          collections: {
            'profile.json': expect.any(Number),
            'post/post.json': expect.any(Number),
            'post/createPost.json': expect.any(Number),
          },
        },
        files: {
          config: 'config.json',
          collections: [
            'profile.json',
            'post/post.json',
            'post/createPost.json',
          ],
        },
      });
    });

    test('collection config is missing', async () => {
      mockWorkspace({
        ...baseStructure,
        '/workspace/collections': [
          file({ name: 'profile.json', baseDir: '/workspace/collections' }),
          dir({ name: 'post', baseDir: '/workspace/collections' }),
        ],
        '/workspace/collections/post': [
          file({
            name: 'createPost.json',
            baseDir: '/workspace/collections/post',
          }),
        ],
      });

      const result = await scanWorkspace('/workspace');
      expect(result).toStrictEqual({
        timestamps: {
          config: expect.any(Number),
          collections: {
            'profile.json': expect.any(Number),
          },
        },
        files: {
          config: 'config.json',
          collections: ['profile.json'],
        },
      });
    });
  });

  describe('with request folder', () => {
    const baseStructure = {
      '/workspace': [
        file({ name: 'config.json', baseDir: '/workspace' }),
        dir({ name: 'collections', baseDir: '/workspace' }),
      ],
      '/workspace/collections': [
        file({ name: 'profile.json', baseDir: '/workspace/collections' }),
        dir({ name: 'post', baseDir: '/workspace/collections' }),
      ],
    };

    test('request folder is ignored', async () => {
      mockWorkspace({
        ...baseStructure,
        '/workspace/collections/post': [
          file({
            name: 'post.json',
            baseDir: '/workspace/collections/post',
          }),
          file({
            name: 'createPost.json',
            baseDir: '/workspace/collections/post',
          }),
          dir({
            name: 'createPost',
            baseDir: '/workspace/collections/post',
          }),
        ],
        '/workspace/collections/post/createPost': [
          file({
            name: 'createPost.json',
            baseDir: '/workspace/collections/post/createPost',
          }),
        ],
      });

      const result = await scanWorkspace('/workspace');
      expect(result).toStrictEqual({
        timestamps: {
          config: expect.any(Number),
          collections: {
            'profile.json': expect.any(Number),
            'post/post.json': expect.any(Number),
            'post/createPost.json': expect.any(Number),
          },
        },
        files: {
          config: 'config.json',
          collections: [
            'profile.json',
            'post/post.json',
            'post/createPost.json',
          ],
        },
      });
    });

    test('valid request folder', async () => {
      mockWorkspace({
        ...baseStructure,
        '/workspace/collections/post': [
          file({
            name: 'post.json',
            baseDir: '/workspace/collections/post',
          }),
          dir({
            name: 'createPost',
            baseDir: '/workspace/collections/post',
          }),
        ],
        '/workspace/collections/post/createPost': [
          file({
            name: 'createPost.json',
            baseDir: '/workspace/collections/post/createPost',
          }),
        ],
      });

      const result = await scanWorkspace('/workspace');
      expect(result).toStrictEqual({
        timestamps: {
          config: expect.any(Number),
          collections: {
            'profile.json': expect.any(Number),
            'post/post.json': expect.any(Number),
            'post/createPost/createPost.json': expect.any(Number),
          },
        },
        files: {
          config: 'config.json',
          collections: [
            'profile.json',
            'post/post.json',
            'post/createPost/createPost.json',
          ],
        },
      });
    });

    test('request config is missing', async () => {
      mockWorkspace({
        ...baseStructure,
        '/workspace/collections/post': [
          file({
            name: 'post.json',
            baseDir: '/workspace/collections/post',
          }),
          dir({
            name: 'createPost',
            baseDir: '/workspace/collections/post',
          }),
        ],
        '/workspace/collections/post/createPost': [
          file({
            name: 'createPost.md',
            baseDir: '/workspace/collections/post/createPost',
          }),
        ],
      });

      const result = await scanWorkspace('/workspace');
      expect(result).toStrictEqual({
        timestamps: {
          config: expect.any(Number),
          collections: {
            'profile.json': expect.any(Number),
            'post/post.json': expect.any(Number),
          },
        },
        files: {
          config: 'config.json',
          collections: ['profile.json', 'post/post.json'],
        },
      });
    });
  });

  test('complex structure', async () => {
    mockWorkspace({
      '/workspace': [
        file({ name: 'config.json', baseDir: '/workspace' }),
        dir({ name: 'collections', baseDir: '/workspace' }),
      ],
      '/workspace/collections': [
        file({ name: 'profile.json', baseDir: '/workspace/collections' }),
        dir({ name: 'post', baseDir: '/workspace/collections' }),
        dir({ name: 'article', baseDir: '/workspace/collections' }),
      ],
      '/workspace/collections/post': [
        file({
          name: 'post.json',
          baseDir: '/workspace/collections/post',
        }),
        file({
          name: 'post.md',
          baseDir: '/workspace/collections/post',
        }),
        dir({
          name: 'createPost',
          baseDir: '/workspace/collections/post',
        }),
        dir({
          name: 'createPost.md',
          baseDir: '/workspace/collections/post',
        }),
        file({
          name: 'deletePost.json',
          baseDir: '/workspace/collections/post',
        }),
        file({
          name: 'deletePost.md',
          baseDir: '/workspace/collections/post',
        }),
      ],
      '/workspace/collections/article': [
        file({
          name: 'getArticle.md',
          baseDir: '/workspace/collections/article',
        }),
      ],
      '/workspace/collections/post/createPost': [
        file({
          name: 'createPost.json',
          baseDir: '/workspace/collections/post/createPost',
        }),
        file({
          name: 'createPost.md',
          baseDir: '/workspace/collections/post/createPost',
        }),
        file({
          name: 'createPost.test.js',
          baseDir: '/workspace/collections/post/createPost',
        }),
        file({
          name: 'createPost.test.json',
          baseDir: '/workspace/collections/post/createPost',
        }),
      ],
    });

    const result = await scanWorkspace('/workspace');
    expect(result).toStrictEqual({
      timestamps: {
        config: expect.any(Number),
        collections: {
          'profile.json': expect.any(Number),
          'post/post.json': expect.any(Number),
          'post/createPost/createPost.json': expect.any(Number),
          'post/createPost/createPost.md': expect.any(Number),
          'post/createPost/createPost.test.js': expect.any(Number),
          'post/createPost/createPost.test.json': expect.any(Number),
          'post/deletePost.json': expect.any(Number),
          'post/deletePost.md': expect.any(Number),
        },
      },
      files: {
        config: 'config.json',
        collections: [
          'profile.json',
          'post/post.json',
          'post/createPost/createPost.json',
          'post/createPost/createPost.md',
          'post/createPost/createPost.test.js',
          'post/createPost/createPost.test.json',
          'post/deletePost.json',
          'post/deletePost.md',
        ],
      },
    });
  });
});
