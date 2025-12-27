import { readConfigFile } from '@/repositories/loadProject/readConfigFile';
import { readJsonRecord } from '@/helpers/fileIO';
import { joinPath, resolvePath } from '@/helpers/pathHelpers';

jest.mock('@/definitions', () => {
  const actual = jest.requireActual('@/definitions');
  return {
    ...actual,
    WORKSPACE_CONFIG_FILE: 'config.json',
    WORKSPACE_DIR: 'api-studio',
  };
});

jest.mock('@/helpers/fileIO', () => ({
  readJsonRecord: jest.fn(),
}));

jest.mock('@/helpers/pathHelpers', () => ({
  joinPath: jest.fn(),
  resolvePath: jest.fn(),
}));

const mockReadJsonRecord = readJsonRecord as jest.Mock;
const mockJoinPath = joinPath as jest.Mock;
const mockResolvePath = resolvePath as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();

  mockJoinPath.mockImplementation((a: string, b: string) => `${a}/${b}`);
  mockResolvePath.mockImplementation(
    ({
      absoluteDir,
      relativePath,
    }: {
      absoluteDir: string;
      relativePath: string;
    }) => `${absoluteDir}::${relativePath}`,
  );
});

describe('readConfigFile', () => {
  test('config file does not exist', async () => {
    mockReadJsonRecord.mockRejectedValueOnce({
      code: 'fileNotFound',
    });
    await expect(readConfigFile('/project')).rejects.toMatchObject({
      code: 'fileNotFound',
    });
  });

  test('invalid openapi value', async () => {
    mockReadJsonRecord.mockResolvedValueOnce({
      json: { overlays: ['a.yaml'] },
    });

    await expect(readConfigFile('/project')).rejects.toMatchObject({
      code: 'invalidOpenapi',
    });

    mockReadJsonRecord.mockResolvedValueOnce({ json: { openapi: 123 } });

    await expect(readConfigFile('/project')).rejects.toMatchObject({
      code: 'invalidOpenapi',
    });

    expect(mockResolvePath).not.toHaveBeenCalled();
  });

  test('no overlays', async () => {
    mockReadJsonRecord.mockResolvedValueOnce({
      json: { openapi: './openapi.yaml' },
    });

    await expect(readConfigFile('/project')).resolves.toEqual({
      openApiEntryPath: '/project/api-studio::./openapi.yaml',
      overlaysPaths: [],
    });

    expect(mockResolvePath).toHaveBeenCalledWith({
      absoluteDir: '/project/api-studio',
      relativePath: './openapi.yaml',
    });
  });

  test('parses overlaysPaths', async () => {
    mockReadJsonRecord.mockResolvedValueOnce({
      json: {
        openapi: 'openapi.yaml',
        overlays: ['o1.yaml', 123, null, { a: 1 }, 'o2.yaml'],
      },
    });

    await expect(readConfigFile('/project')).resolves.toEqual({
      openApiEntryPath: '/project/api-studio::openapi.yaml',
      overlaysPaths: [
        '/project/api-studio::o1.yaml',
        '/project/api-studio::o2.yaml',
      ],
    });

    expect(mockResolvePath).toHaveBeenCalledTimes(3);
  });

  test('overlays is not an array', async () => {
    mockReadJsonRecord.mockResolvedValueOnce({
      json: {
        openapi: 'openapi.yaml',
        overlays: 'not-an-array',
      },
    });

    await expect(readConfigFile('/project')).resolves.toEqual({
      openApiEntryPath: '/project/api-studio::openapi.yaml',
      overlaysPaths: [],
    });

    expect(mockResolvePath).toHaveBeenCalledTimes(1);
  });
});
