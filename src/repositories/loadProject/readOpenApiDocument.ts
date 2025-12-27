import { getFileInfo, readJsonRecord } from '@/helpers/fileIO';
import { type OpenApiDocument } from './types';
import { AppError } from '@/definitions';
import { fnv1a32Hex } from '@/helpers/fnv1a32Hex';

const URL_REF_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//;

type LoadedOpenApiDocument = Omit<OpenApiDocument, 'externalRefs'>;

function isUrlRef(s: string): boolean {
  return URL_REF_RE.test(s);
}

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
): Promise<LoadedOpenApiDocument> {
  if (isUrlRef(path)) {
    throw new AppError({
      code: 'unsupportedTarget',
      message: 'url ref is not supported in this loader',
      data: { path },
    });
  }

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

  const { json, type: format, text } = data;
  const { mtime } = fileInfo;

  return {
    path,
    format,
    text,
    mtime,
    json,
    hash: fnv1a32Hex(text),
  };
}
