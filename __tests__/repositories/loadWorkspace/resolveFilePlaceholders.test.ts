import RNFS from 'react-native-fs';
import { resolvePath } from '@/helpers/pathHelpers';
import { resolveFilePlaceholders } from '@/repositories/loadWorkspace/resolveFilePlaceholders';

jest.mock('react-native-fs', () => ({
  readFile: jest.fn(),
}));

jest.mock('@/helpers/pathHelpers', () => ({
  resolvePath: jest.fn(),
}));

const mockedReadFile = RNFS.readFile as jest.Mock;
const mockedResolvePath = resolvePath as jest.Mock;

describe('resolveFilePlaceholders', () => {
  const baseDir = '/root/workspace/config';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('no placeholder found', async () => {
    const content = {
      name: 'test',
      nested: {
        value: 'no placeholder',
      },
    };

    const result = await resolveFilePlaceholders({ baseDir, content });

    expect(result).toEqual(content);
    expect(mockedReadFile).not.toHaveBeenCalled();
  });

  test('json file', async () => {
    const content = {
      response: '@file:../data/hello.json',
    };

    mockedResolvePath.mockReturnValue('/root/path/data/hello.json');
    mockedReadFile.mockResolvedValueOnce('{"hello":"world","count":1}');

    const result = await resolveFilePlaceholders({ baseDir, content });

    expect(mockedResolvePath).toHaveBeenCalledWith({
      absoluteDir: baseDir,
      relativePath: '../data/hello.json',
    });

    expect(mockedReadFile).toHaveBeenCalledWith(
      '/root/path/data/hello.json',
      'utf8',
    );

    expect(result).toEqual({
      response: {
        hello: 'world',
        count: 1,
      },
    });
  });

  test('plain text', async () => {
    const content = {
      response: '@file:../data/hello.txt',
    };

    mockedResolvePath.mockReturnValue('/foo/path/data/hello.txt');
    mockedReadFile.mockResolvedValueOnce('plain text content');

    const result = await resolveFilePlaceholders({ baseDir, content });

    expect(result).toEqual({
      response: 'plain text content',
    });
  });

  test('nested objects and arrays', async () => {
    const content = {
      routes: [
        {
          name: 'route1',
          response: '@file:../data/route1.json',
        },
      ],
      meta: {
        doc: '@file:../docs/meta.txt',
      },
    };

    mockedResolvePath
      .mockReturnValueOnce('/foo/path/data/route1.json')
      .mockReturnValueOnce('/foo/path/docs/meta.txt');

    mockedReadFile
      .mockResolvedValueOnce('{"ok":true}')
      .mockResolvedValueOnce('meta text');

    const result = await resolveFilePlaceholders({ baseDir, content });

    expect(result).toEqual({
      routes: [
        {
          name: 'route1',
          response: { ok: true },
        },
      ],
      meta: {
        doc: 'meta text',
      },
    });
  });

  test('read file throws', async () => {
    const value = '@file:../data/missing.json';
    const content = { response: value };

    mockedResolvePath.mockReturnValue('/foo/path/data/missing.json');
    mockedReadFile.mockRejectedValueOnce(new Error('File not found'));

    const result = await resolveFilePlaceholders({ baseDir, content });

    expect(result).toEqual({ response: value });
  });

  test('JSON parse fails', async () => {
    const value = '@file:../data/broken.json';
    const content = { response: value };

    mockedResolvePath.mockReturnValue('/foo/path/data/broken.json');
    mockedReadFile.mockResolvedValueOnce('not valid json');

    const result = await resolveFilePlaceholders({ baseDir, content });

    expect(result).toEqual({ response: value });
  });

  test('unsupported extension', async () => {
    const content = {
      response: '@file:../data/image.png',
    };

    const result = await resolveFilePlaceholders({ baseDir, content });

    expect(result).toEqual(content);
    expect(mockedReadFile).not.toHaveBeenCalled();
    expect(mockedResolvePath).not.toHaveBeenCalled();
  });

  test('ignore placeholders inside loaded JSON', async () => {
    const content = {
      response: '@file:../data/outer.json',
    };

    mockedResolvePath.mockReturnValue('/foo/path/data/outer.json');
    mockedReadFile.mockResolvedValueOnce(
      JSON.stringify({
        nested: '@file:../data/inner.json',
      }),
    );

    const result = await resolveFilePlaceholders({ baseDir, content });

    expect(result).toEqual({
      response: {
        nested: '@file:../data/inner.json',
      },
    });

    // Only outer file read
    expect(mockedReadFile).toHaveBeenCalledTimes(1);
  });
});
