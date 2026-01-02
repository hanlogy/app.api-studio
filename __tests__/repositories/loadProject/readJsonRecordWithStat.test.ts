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

  test('stat unchanged', async () => {
    const path = '/tmp/config.json';

    const previous = {
      path,
      type: 'json',
      text: '{"a":1}',
      json: { a: 1 },
      mtime: 1700000000000,
      size: 123,
      hash: 'deadbeef',
    } as const;

    checkFileExistsMock.mockResolvedValue(true);
    statFileMock.mockResolvedValue({
      mtime: previous.mtime,
      size: previous.size,
    });

    const result = await readJsonRecordWithStat(path, previous);

    expect(checkFileExistsMock).toHaveBeenCalledWith(path);
    expect(statFileMock).toHaveBeenCalledTimes(1);
    expect(statFileMock).toHaveBeenCalledWith(path);

    // no re-read if unchanged
    expect(readJsonRecordMock).not.toHaveBeenCalled();

    // returns the exact same reference
    expect(result).toBe(previous);
  });

  test('stat changed', async () => {
    const path = '/tmp/config.json';
    const previous = {
      path,
      type: 'json',
      text: '{"a":1}',
      json: { a: 1 },
      mtime: 1700000000000,
      size: 123,
      hash: 'deadbeef',
    } as const;

    const textNew = '{"a":2}';

    checkFileExistsMock.mockResolvedValue(true);

    // 1st stat: quick check (different -> triggers re-read)
    // 2nd stat: used in Promise.all result
    statFileMock
      .mockResolvedValueOnce({ mtime: previous.mtime + 1, size: previous.size })
      .mockResolvedValueOnce({
        mtime: previous.mtime + 1,
        size: previous.size,
      });

    readJsonRecordMock.mockResolvedValue({
      path,
      type: 'json',
      text: textNew,
      json: { a: 2 },
    });

    const result = await readJsonRecordWithStat(path, previous);

    expect(checkFileExistsMock).toHaveBeenCalledWith(path);
    expect(statFileMock).toHaveBeenCalledTimes(2);
    expect(readJsonRecordMock).toHaveBeenCalledTimes(1);
    expect(readJsonRecordMock).toHaveBeenCalledWith(path);

    expect(result).toStrictEqual({
      path,
      type: 'json',
      text: textNew,
      json: { a: 2 },
      mtime: previous.mtime + 1,
      size: previous.size,
      hash: expect.any(String),
    });

    expect(result).not.toBe(previous);
  });
});
