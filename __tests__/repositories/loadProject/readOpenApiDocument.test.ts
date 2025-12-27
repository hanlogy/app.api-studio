import { AppError } from '@/definitions';
import { getFileInfo, readJsonRecord } from '@/helpers/fileIO';
import { fnv1a32Hex } from '@/helpers/fnv1a32Hex';
import { readOpenApiDocument } from '@/repositories/loadProject/readOpenApiDocument';

jest.mock('@/helpers/fileIO', () => ({
  readJsonRecord: jest.fn(),
  getFileInfo: jest.fn(),
}));

jest.mock('@/helpers/fnv1a32Hex', () => ({
  fnv1a32Hex: jest.fn(),
}));

const readJsonRecordMock = readJsonRecord as jest.MockedFunction<
  typeof readJsonRecord
>;
const getFileInfoMock = getFileInfo as jest.MockedFunction<typeof getFileInfo>;
const fnv1a32HexMock = fnv1a32Hex as jest.MockedFunction<typeof fnv1a32Hex>;

describe('readOpenApiDocument', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('URL refs', async () => {
    await expect(
      readOpenApiDocument('https://example.com/openapi.json'),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      readOpenApiDocument('https://example.com/openapi.json'),
    ).rejects.toMatchObject({
      code: 'unsupportedTarget',
      message: expect.any(String),
      data: { path: 'https://example.com/openapi.json' },
    });

    expect(readJsonRecordMock).not.toHaveBeenCalled();
    expect(getFileInfoMock).not.toHaveBeenCalled();
    expect(fnv1a32HexMock).not.toHaveBeenCalled();
  });

  test('success', async () => {
    const path = '/tmp/spec.json';
    const mtime = new Date('2025-12-27T10:00:00.000Z').getTime();
    const text = '{"openapi":"3.0.0"}';
    const json = { openapi: '3.0.0' };

    readJsonRecordMock.mockResolvedValue({ json, type: 'json', text });
    getFileInfoMock.mockResolvedValue({ mtime } as any);
    fnv1a32HexMock.mockReturnValue('AAAAAAA');

    await expect(readOpenApiDocument(path)).resolves.toEqual({
      path,
      format: 'json',
      text,
      mtime,
      json,
      hash: 'AAAAAAA',
    });

    expect(readJsonRecordMock).toHaveBeenCalledWith(path);
    expect(getFileInfoMock).toHaveBeenCalledWith(path);
    expect(fnv1a32HexMock).toHaveBeenCalledWith(text);
  });

  test('readJsonRecord throws', async () => {
    const path = '/tmp/spec.json';
    const error = new AppError({
      code: 'foo',
      message: 'message',
      data: { path },
    });

    readJsonRecordMock.mockRejectedValue(error);
    getFileInfoMock.mockResolvedValue({ mtime: new Date() } as any);

    await expect(readOpenApiDocument(path)).rejects.toBe(error);
  });

  test('throw unknown error', async () => {
    const path = '/tmp/spec.json';
    const cause = new Error('boom');

    readJsonRecordMock.mockRejectedValue(cause);
    getFileInfoMock.mockResolvedValue({ mtime: new Date() } as any);

    await expect(readOpenApiDocument(path)).rejects.toBeInstanceOf(AppError);
    await expect(readOpenApiDocument(path)).rejects.toMatchObject({
      code: 'unknown',
      message: expect.any(String),
      data: { path, cause },
    });
  });

  test('getFileInfo throws', async () => {
    const path = '/tmp/spec.json';
    const original = new AppError({
      code: 'fileStatFailed',
      message: expect.any(String),
      data: { path },
    });

    readJsonRecordMock.mockResolvedValue({
      json: { foo: true },
      type: 'json',
      text: '{"foo":true}',
    });

    getFileInfoMock.mockRejectedValue(original);

    await expect(readOpenApiDocument(path)).rejects.toBe(original);
  });
});
