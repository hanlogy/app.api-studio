import { scanWorkspace } from '@/repositories/loadWorkspace/scanWorkspace';
import RNFS from 'react-native-fs';

jest.mock('react-native-fs', () => ({
  readDir: jest.fn(),
}));

type FSItem =
  | {
      readonly type: 'file';
      readonly name: string;
    }
  | {
      readonly type: 'dir';
      readonly name: string;
      readonly children?: readonly FSItem[];
    };

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

export function mockWorkspace(
  structure: readonly FSItem[],
  root = '/workspace',
) {
  const mockReadDir = RNFS.readDir as jest.Mock;
  const fs: Record<string, Partial<RNFS.ReadDirItem>[]> = {};

  const ensureDir = (path: string) => {
    if (!fs[path]) {
      fs[path] = [];
    }
  };

  const walk = (items: readonly FSItem[], baseDir: string) => {
    ensureDir(baseDir);

    for (const item of items) {
      if (item.type === 'file') {
        fs[baseDir].push(
          createItem({ name: item.name, baseDir, isDir: false }),
        );
      } else {
        fs[baseDir].push(createItem({ name: item.name, baseDir, isDir: true }));

        const nextBase = `${baseDir}/${item.name}`;
        if (item.children && item.children.length > 0) {
          walk(item.children, nextBase);
        }
      }
    }
  };

  walk(structure, root);

  mockReadDir.mockImplementation((path: string) =>
    Promise.resolve(fs[path] ?? []),
  );
}

describe('scanWorkspace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('empty workspace', async () => {
    mockWorkspace([]);

    const result = await scanWorkspace('/workspace');
    expect(result).toBeUndefined();
  });

  test('not a valid workspace', async () => {
    const workspace = [
      {
        type: 'file',
        name: 'README.md',
      },
      {
        type: 'dir',
        name: 'collections',
      },
    ] as const;

    mockWorkspace(workspace);

    const result = await scanWorkspace('/workspace');
    expect(result).toBeUndefined();
  });

  test('only a config file', async () => {
    const workspace = [{ type: 'file', name: 'config.json' }] as const;
    mockWorkspace(workspace);

    const result = await scanWorkspace('/workspace');
    expect(result).toStrictEqual({
      timestamps: { config: expect.any(Number), collections: {} },
      files: { config: 'config.json', collections: [] },
    });
  });

  test('no valid collections', async () => {
    const workspace = [
      { type: 'file', name: 'config.json' },
      {
        type: 'dir',
        name: 'collections',
        children: [{ type: 'file', name: 'test.md' }],
      },
    ] as const;
    mockWorkspace(workspace);

    const result = await scanWorkspace('/workspace');
    expect(result).toStrictEqual({
      timestamps: { config: expect.any(Number), collections: {} },
      files: { config: 'config.json', collections: [] },
    });
  });

  test('valid collections', async () => {
    const workspace = [
      {
        type: 'file',
        name: 'config.json',
      },
      {
        type: 'dir',
        name: 'collections',
        children: [
          { type: 'file', name: 'user.json' },
          { type: 'file', name: 'profile.json' },
          { type: 'dir', name: 'post' },
        ],
      },
    ] as const;

    mockWorkspace(workspace);

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
    test('collection folder is ignored', async () => {
      mockWorkspace([
        { type: 'file', name: 'config.json' },
        {
          type: 'dir',
          name: 'collections',
          children: [
            { type: 'file', name: 'profile.json' },
            { type: 'file', name: 'post.json' },
            {
              type: 'dir',
              name: 'post',
              children: [
                { type: 'file', name: 'createPost.json' },
                { type: 'file', name: 'post.json' },
              ],
            },
          ],
        },
      ]);

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
      mockWorkspace([
        { type: 'file', name: 'config.json' },
        {
          type: 'dir',
          name: 'collections',
          children: [
            { type: 'file', name: 'profile.json' },
            {
              type: 'dir',
              name: 'post',
              children: [
                { type: 'file', name: 'post.json' },
                { type: 'file', name: 'createPost.json' },
              ],
            },
          ],
        },
      ]);

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
      mockWorkspace([
        { type: 'file', name: 'config.json' },
        {
          type: 'dir',
          name: 'collections',
          children: [
            { type: 'file', name: 'profile.json' },
            {
              type: 'dir',
              name: 'post',
              children: [{ type: 'file', name: 'createPost.json' }],
            },
          ],
        },
      ]);

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
    test('request folder is ignored', async () => {
      mockWorkspace([
        { type: 'file', name: 'config.json' },
        {
          type: 'dir',
          name: 'collections',
          children: [
            { type: 'file', name: 'profile.json' },
            {
              type: 'dir',
              name: 'post',
              children: [
                { type: 'file', name: 'post.json' },
                { type: 'file', name: 'createPost.json' },
                {
                  type: 'dir',
                  name: 'createPost',
                  children: [{ type: 'file', name: 'createPost.json' }],
                },
              ],
            },
          ],
        },
      ]);

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
      mockWorkspace([
        { type: 'file', name: 'config.json' },
        {
          type: 'dir',
          name: 'collections',
          children: [
            { type: 'file', name: 'profile.json' },
            {
              type: 'dir',
              name: 'post',
              children: [
                { type: 'file', name: 'post.json' },
                {
                  type: 'dir',
                  name: 'createPost',
                  children: [{ type: 'file', name: 'createPost.json' }],
                },
              ],
            },
          ],
        },
      ]);

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
      mockWorkspace([
        { type: 'file', name: 'config.json' },
        {
          type: 'dir',
          name: 'collections',
          children: [
            { type: 'file', name: 'profile.json' },
            {
              type: 'dir',
              name: 'post',
              children: [
                { type: 'file', name: 'post.json' },
                {
                  type: 'dir',
                  name: 'createPost',
                  children: [{ type: 'file', name: 'createPost.md' }],
                },
              ],
            },
          ],
        },
      ]);

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
    mockWorkspace([
      { type: 'file', name: 'config.json' },
      {
        type: 'dir',
        name: 'collections',
        children: [
          { type: 'file', name: 'profile.json' },
          { type: 'file', name: 'profile.md' },
          {
            type: 'dir',
            name: 'post',
            children: [
              { type: 'file', name: 'post.json' },
              { type: 'file', name: 'post.md' },
              { type: 'file', name: 'deletePost.json' },
              { type: 'file', name: 'deletePost.md' },
              { type: 'file', name: 'createPost.md' },
              {
                type: 'dir',
                name: 'createPost',
                children: [
                  { type: 'file', name: 'createPost.json' },
                  { type: 'file', name: 'createPost.md' },
                  { type: 'file', name: 'createPost.test.js' },
                  { type: 'file', name: 'createPost.test.json' },
                ],
              },
            ],
          },
          {
            type: 'dir',
            name: 'article',
            children: [{ type: 'file', name: 'getArticle.md' }],
          },
        ],
      },
    ]);

    const result = await scanWorkspace('/workspace');
    expect(result).toStrictEqual({
      timestamps: {
        config: expect.any(Number),
        collections: {
          'profile.json': expect.any(Number),
          'profile.md': expect.any(Number),
          'post/post.json': expect.any(Number),
          'post/post.md': expect.any(Number),
          'post/deletePost.json': expect.any(Number),
          'post/deletePost.md': expect.any(Number),
          'post/createPost/createPost.json': expect.any(Number),
          'post/createPost/createPost.md': expect.any(Number),
          'post/createPost/createPost.test.js': expect.any(Number),
          'post/createPost/createPost.test.json': expect.any(Number),
        },
      },
      files: {
        config: 'config.json',
        collections: [
          'profile.json',
          'profile.md',
          'post/post.json',
          'post/post.md',
          'post/deletePost.json',
          'post/deletePost.md',
          'post/createPost/createPost.json',
          'post/createPost/createPost.md',
          'post/createPost/createPost.test.js',
          'post/createPost/createPost.test.json',
        ],
      },
    });
  });
});
