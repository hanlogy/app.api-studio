import RNFS from 'react-native-fs';
import YAML from 'yaml';

import { getExtension } from '@/helpers/fileHelpers';
import { isPlainObject } from '@/helpers/checkTypes';
import { readJsonRecord } from '@/helpers/fileIO';

jest.mock('react-native-fs', () => ({
  exists: jest.fn(),
  readFile: jest.fn(),
  LibraryDirectoryPath: '/Library',
  mkdir: jest.fn(),
  writeFile: jest.fn(),
  stat: jest.fn(),
}));

jest.mock('yaml', () => ({
  parse: jest.fn(),
}));

jest.mock('@/helpers/fileHelpers', () => ({
  getExtension: jest.fn(),
}));

jest.mock('@/helpers/checkTypes', () => ({
  isPlainObject: jest.fn(),
}));

const rnfsExists = RNFS.exists as unknown as jest.Mock;
const rnfsReadFile = RNFS.readFile as unknown as jest.Mock;
const yamlParse = (YAML as any).parse as jest.Mock;
const mockGetExtension = getExtension as unknown as jest.Mock;
const mockIsPlainObject = isPlainObject as unknown as jest.Mock;

describe('readJsonRecord', () => {
  const path = '/tmp/test-file';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('unsupported file type', async () => {
    mockGetExtension.mockReturnValue('txt');
    await expect(readJsonRecord(path)).rejects.toMatchObject({
      code: 'unsupportedFileType',
      data: { path },
    });

    expect(rnfsExists).not.toHaveBeenCalled();
    expect(rnfsReadFile).not.toHaveBeenCalled();
    expect(yamlParse).not.toHaveBeenCalled();
  });

  test('JSON file', async () => {
    mockGetExtension.mockReturnValue('json');
    rnfsExists.mockResolvedValue(true);
    rnfsReadFile.mockResolvedValue('{"a":1}');
    mockIsPlainObject.mockReturnValue(true);

    await expect(readJsonRecord(path)).resolves.toStrictEqual({
      type: 'json',
      text: '{"a":1}',
      json: { a: 1 },
    });

    expect(rnfsExists).toHaveBeenCalledWith(path);
    expect(rnfsReadFile).toHaveBeenCalledWith(path, 'utf8');
    expect(yamlParse).not.toHaveBeenCalled();
    expect(mockIsPlainObject).toHaveBeenCalledWith({ a: 1 });
  });

  test('YAML file', async () => {
    mockGetExtension.mockReturnValue('yaml');
    rnfsExists.mockResolvedValue(true);
    rnfsReadFile.mockResolvedValue('a: 1');
    yamlParse.mockReturnValue({ a: 1 });
    mockIsPlainObject.mockReturnValue(true);

    await expect(readJsonRecord(path)).resolves.toStrictEqual({
      type: 'yaml',
      text: 'a: 1',
      json: { a: 1 },
    });

    expect(yamlParse).toHaveBeenCalledWith('a: 1');
    expect(mockIsPlainObject).toHaveBeenCalledWith({ a: 1 });
  });

  test('not a plain object', async () => {
    mockGetExtension.mockReturnValue('json');
    rnfsExists.mockResolvedValue(true);
    rnfsReadFile.mockResolvedValue('[]');
    mockIsPlainObject.mockReturnValue(false);

    await expect(readJsonRecord(path)).rejects.toMatchObject({
      code: 'invalidRecord',
    });
  });

  test('JSON parsing fails', async () => {
    mockGetExtension.mockReturnValue('json');
    rnfsExists.mockResolvedValue(true);
    rnfsReadFile.mockResolvedValue('{');

    await expect(readJsonRecord(path)).rejects.toMatchObject({
      code: 'parseFailed',
    });
  });

  test('YAML parsing fails', async () => {
    mockGetExtension.mockReturnValue('yml');
    rnfsExists.mockResolvedValue(true);
    rnfsReadFile.mockResolvedValue('a: [');
    yamlParse.mockImplementation(() => {
      throw new Error('bad yaml');
    });

    await expect(readJsonRecord(path)).rejects.toMatchObject({
      code: 'parseFailed',
    });
  });
});
