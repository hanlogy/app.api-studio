import { type JsonRecord } from '@/definitions';
import RNFS from 'react-native-fs';
import { isPlainObject } from './checkTypes';
import { getDirFromFilePath } from './pathHelpers';

export const CACHE_FOLDER = `${RNFS.LibraryDirectoryPath}/Application Support/ApiStudio`;

export async function readJsonRecord(path: string): Promise<JsonRecord | null> {
  const content = await readPlainText(path);
  if (!content) {
    return null;
  }

  try {
    const value = JSON.parse(content);

    if (isPlainObject(value)) {
      return value as JsonRecord;
    }

    return null;
  } catch {
    return null;
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

export async function readPlainText(path: string): Promise<string | null> {
  const exists = await RNFS.exists(path);
  if (!exists) {
    return null;
  }

  return await RNFS.readFile(path, 'utf8');
}
