import { AppError } from '@/definitions';
import * as fileIO from '@/helpers/fileIO';
import { readJsonRecordWithStat } from '@/repositories/loadProject/readJsonRecordWithStat';

const checkFileExistsMock = jest.spyOn(fileIO, 'checkFileExists');
const readJsonRecordMock = jest.spyOn(fileIO, 'readJsonRecord');
const statFileMock = jest.spyOn(fileIO, 'statFile');

describe('readJsonRecordWithStat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('all good', async () => {
    const path = '/tmp/config.json';
    const text = '{"a":1}';

    checkFileExistsMock.mockResolvedValue(true);
    readJsonRecordMock.mockResolvedValue({
      path,
      type: 'json',
      text,
      json: { a: 1 },
    });
    statFileMock.mockResolvedValue({ mtime: 1700000000000, size: 123 });

    const result = await readJsonRecordWithStat(path);

    expect(checkFileExistsMock).toHaveBeenCalledWith(path);
    expect(readJsonRecordMock).toHaveBeenCalledWith(path);
    expect(statFileMock).toHaveBeenCalledWith(path);

    expect(result).toStrictEqual({
      path,
      type: 'json',
      text,
      json: { a: 1 },
      mtime: 1700000000000,
      size: 123,
      hash: expect.any(String),
    });
  });

  test('file does not exist', async () => {
    const path = '/tmp/missing.json';
    checkFileExistsMock.mockResolvedValue(false);

    await expect(readJsonRecordWithStat(path)).rejects.toMatchObject({
      code: 'fileNotExist',
      meta: { path },
    });

    expect(readJsonRecordMock).not.toHaveBeenCalled();
    expect(statFileMock).not.toHaveBeenCalled();
  });

  test('readJsonRecord throws', async () => {
    const path = '/tmp/bad.json';
    checkFileExistsMock.mockResolvedValue(true);

    const error = new AppError({
      code: 'parseFailed',
      message: 'Failed to parse json file.',
      meta: { path },
    });
    readJsonRecordMock.mockRejectedValue(error);

    await expect(readJsonRecordWithStat(path)).rejects.toBe(error);
    expect(statFileMock).not.toHaveBeenCalled();
  });

  test('statFile throws', async () => {
    const path = '/tmp/config.json';
    const text = '{"a":1}';

    checkFileExistsMock.mockResolvedValue(true);
    readJsonRecordMock.mockResolvedValue({
      path,
      type: 'json',
      text,
      json: { a: 1 },
    });

    const error = new AppError({
      code: 'statFileFailed',
      message: `Failed to stat file: ${path}`,
      meta: { path },
    });
    statFileMock.mockRejectedValue(error);

    await expect(readJsonRecordWithStat(path)).rejects.toBe(error);
  });
});
