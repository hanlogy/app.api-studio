import { readConfigFile } from '@/repositories/loadProject/readConfigFile';
import { joinPath, resolvePath } from '@/helpers/pathHelpers';
import * as Read from '@/repositories/loadProject/readJsonRecordWithStat';
import type { ConfigDocument } from '@/repositories/loadProject/types';

jest.mock('@/definitions', () => {
  const actual = jest.requireActual('@/definitions');
  return {
    ...actual,
    WORKSPACE_CONFIG_FILE: 'config.json',
  };
});

jest.mock('@/helpers/pathHelpers', () => ({
  joinPath: jest.fn(),
  resolvePath: jest.fn(),
}));

const mockJoinPath = joinPath as jest.Mock;
const mockResolvePath = resolvePath as jest.Mock;
const readJsonRecordWithStatMock = jest.spyOn(
  Read,
  'readJsonRecordWithStat',
) as jest.Mock;

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
    readJsonRecordWithStatMock.mockRejectedValueOnce({
      code: 'fileNotFound',
    });
    await expect(readConfigFile('/dir')).rejects.toMatchObject({
      code: 'fileNotFound',
    });
  });

  test('invalid openapi value', async () => {
    readJsonRecordWithStatMock.mockResolvedValueOnce({
      json: { overlays: ['a.yaml'] },
    });

    await expect(readConfigFile('/dir')).rejects.toMatchObject({
      code: 'invalidOpenapi',
    });

    readJsonRecordWithStatMock.mockResolvedValueOnce({
      json: { openapi: 123 },
    });

    await expect(readConfigFile('/dir')).rejects.toMatchObject({
      code: 'invalidOpenapi',
    });

    expect(mockResolvePath).not.toHaveBeenCalled();
  });

  test('no overlays', async () => {
    const json = { openapi: './openapi.yaml' };
    readJsonRecordWithStatMock.mockResolvedValueOnce({
      type: 'json',
      text: JSON.stringify(json),
      json,
    });

    await expect(readConfigFile('/dir')).resolves.toMatchObject({
      json: {
        openapi: '/dir::./openapi.yaml',
        overlays: [],
      },
    });

    expect(mockResolvePath).toHaveBeenCalledWith({
      absoluteDir: '/dir',
      relativePath: './openapi.yaml',
    });
  });

  test('parses overlays', async () => {
    const json = {
      openapi: 'openapi.yaml',
      overlays: ['o1.yaml', 123, null, { a: 1 }, 'o2.yaml'],
    };
    readJsonRecordWithStatMock.mockResolvedValueOnce({
      type: 'json',
      text: JSON.stringify(json),
      json,
    });

    await expect(readConfigFile('/dir')).resolves.toMatchObject({
      json: {
        openapi: '/dir::openapi.yaml',
        overlays: ['/dir::o1.yaml', '/dir::o2.yaml'],
      },
    });

    expect(mockResolvePath).toHaveBeenCalledTimes(3);
  });

  test('overlays is not an array', async () => {
    const json = {
      openapi: 'openapi.yaml',
      overlays: 'not-an-array',
    };

    readJsonRecordWithStatMock.mockResolvedValueOnce({
      type: 'json',
      text: JSON.stringify(json),
      json,
    });

    await expect(readConfigFile('/project')).resolves.toMatchObject({
      json: {
        openapi: '/project::openapi.yaml',
        overlays: [],
      },
    });

    expect(mockResolvePath).toHaveBeenCalledTimes(1);
  });

  test('resolve path should be unchanged', async () => {
    const apiStudioDir = '/dir';

    const previous: ConfigDocument = {
      path: `${apiStudioDir}/config.json`,
      type: 'json',
      text: '{"openapi":"./openapi.yaml","overlays":["o1.yaml"]}',
      json: {
        // already resolved (the important part)
        openapi: '/dir::./openapi.yaml',
        overlays: ['/dir::o1.yaml'],
      },
      mtime: 1,
      size: 10,
      hash: 'h1',
    };

    readJsonRecordWithStatMock.mockResolvedValueOnce(previous);

    const result = await readConfigFile(apiStudioDir, previous);

    expect(result).toBe(previous);

    // Important: should NOT resolve again
    expect(mockResolvePath).not.toHaveBeenCalled();

    // should call readJsonRecordWithStat with previous
    expect(readJsonRecordWithStatMock).toHaveBeenCalledWith(
      `${apiStudioDir}/config.json`,
      previous,
    );
  });
});
