import YAML from 'yaml';
import RNFS from 'react-native-fs';

import { AppError, type JsonRecord } from '@/definitions';
import { isPlainObject } from './checkTypes';
import { getDirFromFilePath } from './pathHelpers';
import { getExtension } from './fileHelpers';

export const CACHE_FOLDER = `${RNFS.LibraryDirectoryPath}/Application Support/ApiStudio`;

export type JsonRecordFileType = 'yaml' | 'json';

export interface ReadJsonRecordResult {
  type: JsonRecordFileType;
  json: JsonRecord;
  text: string;
}

export type FileStatResult = RNFS.StatResult;

const TYPE_MAP: Record<string, 'json' | 'yaml'> = {
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
};

function createFileNotFoundError(path: string) {
  return new AppError({
    code: 'fileNotFound',
    message: `File not found: ${path}`,
    data: { path },
  });
}

// Support `json`, `yaml`, `yml`
export async function readJsonRecord(
  path: string,
): Promise<ReadJsonRecordResult> {
  const extension = getExtension(path);
  const type = extension && TYPE_MAP[extension];
  const errorData = { path };

  if (!type) {
    throw new AppError({
      code: 'unsupportedFileType',
      message: `Unsupported file type ".${
        extension || 'unknown'
      }". Only .json, .yml, .yaml are supported.`,
      data: errorData,
    });
  }

  const text = await readPlainText(path);

  try {
    const value = type === 'json' ? JSON.parse(text) : YAML.parse(text);

    if (!isPlainObject(value)) {
      throw new AppError({
        code: 'invalidRecord',
        message: `Invalid ${type} content: expected an object record.`,
        data: errorData,
      });
    }

    return { json: value as JsonRecord, text, type };
  } catch (e) {
    if (e instanceof AppError) {
      throw e;
    }

    throw new AppError({
      code: 'parseFailed',
      message: `Failed to parse ${type} file.`,
      data: {
        ...errorData,
        cause: e instanceof Error ? e.message : String(e),
      },
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
  const exists = await RNFS.exists(path);
  if (!exists) {
    throw createFileNotFoundError(path);
  }

  try {
    return await RNFS.readFile(path, 'utf8');
  } catch (e) {
    throw new AppError({
      code: 'readFailed',
      message: `Failed to read file: ${path}`,
      data: { path },
    });
  }
}

export async function getFileInfo(path: string): Promise<FileStatResult> {
  const exists = await RNFS.exists(path);
  if (!exists) {
    throw createFileNotFoundError(path);
  }

  return await RNFS.stat(path);
}
