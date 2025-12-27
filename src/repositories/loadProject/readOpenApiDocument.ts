import { getFileInfo, readJsonRecord } from '@/helpers/fileIO';
import { AppError } from '@/definitions';
import { fnv1a32Hex } from '@/helpers/fnv1a32Hex';
import type { JsonRecordDocument } from './types';

async function withAppError<T>(
  run: () => Promise<T>,
  opts: { message: string; path: string },
): Promise<T> {
  try {
    return await run();
  } catch (e) {
    if (e instanceof AppError) {
      throw e;
    }

    throw new AppError({
      code: 'unknown',
      message: opts.message,
      data: { path: opts.path, cause: e },
    });
  }
}

export async function readOpenApiDocument(
  path: string,
): Promise<JsonRecordDocument> {
  const [data, fileInfo] = await Promise.all([
    withAppError(() => readJsonRecord(path), {
      message: `failed to read and parse from ${path}`,
      path,
    }),

    withAppError(() => getFileInfo(path), {
      message: `failed to read file info from ${path}`,
      path,
    }),
  ]);

  const { json, type, text } = data;

  return {
    path,
    type,
    text,
    json,
    mtime: fileInfo.mtime,
    hash: fnv1a32Hex(text),
  };
}
