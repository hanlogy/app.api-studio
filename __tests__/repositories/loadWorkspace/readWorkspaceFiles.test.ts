import type { JsonRecord } from '@/definitions';
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

const mockWorkspace = (data: Record<string, string | JsonRecord>) => {
  mockPlainText.mockImplementation(({ file }) => {
    if (file in data) {
      const value = data[file];
      if (typeof value !== 'string') {
        throw new Error('never');
      }
      return Promise.resolve(value);
    }

    return Promise.resolve(null);
  });

  mockReadJson.mockImplementation(({ file }) => {
    if (file === 'config.json') {
      return Promise.resolve({ name: 'workspace' });
    }

    if (file in data) {
      const value = data[file];
      if (typeof value === 'string') {
        throw new Error('never');
      }
      return Promise.resolve(value);
    }

    return Promise.resolve(null);
  });
};

describe('readWorkspaceFiles', () => {
  beforeEach(() => {
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

    mockWorkspace(mockCollections);

    const result = await readWorkspaceFiles({
      dir: '/root/workspace',
      files: {
        config: 'config.json',
        collections: Object.keys(mockCollections),
      },
    });

    // console.log(JSON.stringify(result, undefined, 2));
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
    });
  });
});
