import {type JsonRecord} from '@/definitions';
import RNFS from 'react-native-fs';
import {isPlainObject} from './checkTypes';

export const CACHE_FOLDER = `${RNFS.LibraryDirectoryPath}/Application Support/ApiStudio`;

const buildFilePath = ({dir, fileName}: {dir: string; fileName: string}) =>
  `${dir}/${fileName}.json`;

export async function readJsonRecord({
  dir = CACHE_FOLDER,
  fileName,
}: {
  dir?: string;
  fileName: string;
}): Promise<JsonRecord | null> {
  const path = buildFilePath({dir, fileName});
  const exists = await RNFS.exists(path);
  if (!exists) {
    return null;
  }

  try {
    const value = JSON.parse(await RNFS.readFile(path, 'utf8'));

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
  fileName,
  data,
}: {
  dir?: string;
  fileName: string;
  data: unknown;
}) {
  if (!isPlainObject(data)) {
    return;
  }

  const path = buildFilePath({dir, fileName});
  await RNFS.mkdir(dir);
  await RNFS.writeFile(path, JSON.stringify(data), 'utf8');
}
