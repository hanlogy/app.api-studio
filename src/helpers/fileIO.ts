import YAML from 'yaml';
import RNFS from 'react-native-fs';

import { AppError, type JsonRecord } from '@/definitions';
import { isPlainObject } from './checkTypes';
import { getDirFromFilePath } from './pathHelpers';
import { getExtension } from './fileHelpers';

export const CACHE_FOLDER = `${RNFS.LibraryDirectoryPath}/Application Support/ApiStudio`;

export type JsonRecordFileType = 'yaml' | 'json';

export interface JsonRecordDocument<T extends JsonRecord = JsonRecord> {
  readonly path: string;
  readonly type: JsonRecordFileType;
  readonly text: string;
  readonly json: T;
}

export interface FileStatResult {
  readonly mtime: number;
  readonly size: number;
}

const TYPE_MAP: Record<string, 'json' | 'yaml'> = {
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
};

// Support `json`, `yaml`, `yml`
export async function readJsonRecord<T extends JsonRecord = JsonRecord>(
  path: string,
): Promise<JsonRecordDocument<T>> {
  const extension = getExtension(path);
  const type = extension && TYPE_MAP[extension];
  const errorMeta = { path };

  if (!type) {
    throw new AppError({
      code: 'unsupportedFileType',
      message: `Unsupported file type ".${
        extension || 'unknown'
      }". Only .json, .yml, .yaml are supported.`,
      meta: errorMeta,
    });
  }

  const text = await readPlainText(path);

  try {
    const value = type === 'json' ? JSON.parse(text) : YAML.parse(text);

    if (!isPlainObject(value)) {
      throw new AppError({
        code: 'invalidRecord',
        message: `Invalid ${type} content: expected an object record.`,
        meta: errorMeta,
      });
    }

    return { json: value as T, text, type, path };
  } catch (e) {
    if (e instanceof AppError) {
      throw AppError.from(e, { meta: errorMeta });
    }

    throw AppError.from(e, {
      meta: errorMeta,
      code: 'parseFailed',
      message: `Failed to parse ${type} file.`,
    });
  }
}

export async function writeJsonRecord({
  path,
  data,
}: {
  path: string;
  data: unknown;
}) {
  if (!isPlainObject(data)) {
    return;
  }

  const dir = getDirFromFilePath(path);
  await RNFS.mkdir(dir);
  await RNFS.writeFile(path, JSON.stringify(data), 'utf8');
}

export async function readPlainText(path: string): Promise<string> {
  try {
    return await RNFS.readFile(path, 'utf8');
  } catch (e) {
    throw new AppError({
      code: 'readPlainTextFailed',
      message: `Failed to read file: ${path}`,
      meta: { path },
    });
  }
}

export async function statFile(path: string): Promise<FileStatResult> {
  try {
    const { mtime, size } = await RNFS.stat(path);
    return { mtime, size };
  } catch (e) {
    throw new AppError({
      code: 'statFileFailed',
      message: `Failed to stat file: ${path}`,
      meta: { path },
    });
  }
}

export async function checkFileExists(path: string) {
  return RNFS.exists(path);
}
