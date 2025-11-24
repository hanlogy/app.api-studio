import { type JsonRecord } from '@/definitions';
import RNFS from 'react-native-fs';
import { isPlainObject } from './checkTypes';

export const CACHE_FOLDER = `${RNFS.LibraryDirectoryPath}/Application Support/ApiStudio`;

const buildFilePath = ({ dir, file }: { dir: string; file: string }) =>
  `${dir}/${file}`;

export async function readJsonRecord({
  dir = CACHE_FOLDER,
  file,
}: {
  dir?: string;
  file: string;
}): Promise<JsonRecord | null> {
  const content = await readPlainText({ dir, file });
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
  dir = CACHE_FOLDER,
  file,
  data,
}: {
  dir?: string;
  file: string;
  data: unknown;
}) {
  if (!isPlainObject(data)) {
    return;
  }

  const path = buildFilePath({ dir, file });
  await RNFS.mkdir(dir);
  await RNFS.writeFile(path, JSON.stringify(data), 'utf8');
}

export async function readPlainText({
  dir = CACHE_FOLDER,
  file,
}: {
  dir?: string;
  file: string;
}): Promise<string | null> {
  const path = buildFilePath({ dir, file });
  const exists = await RNFS.exists(path);
  if (!exists) {
    return null;
  }

  return await RNFS.readFile(path, 'utf8');
}
