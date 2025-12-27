import YAML from 'yaml';
import RNFS from 'react-native-fs';

import { type JsonRecord } from '@/definitions';
import { isPlainObject } from './checkTypes';
import { getDirFromFilePath } from './pathHelpers';
import { getExtension } from './fileHelpers';

export const CACHE_FOLDER = `${RNFS.LibraryDirectoryPath}/Application Support/ApiStudio`;

const TYPE_MAP: Record<string, 'json' | 'yaml'> = {
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
};

// Support `json`, `yaml`, 'yml'
export async function readJsonRecord(path: string): Promise<{
  type: 'yaml' | 'json';
  json: JsonRecord;
  text: string;
} | null> {
  const extension = getExtension(path);

  const type = extension && TYPE_MAP[extension];
  if (!type) {
    return null;
  }

  const text = await readPlainText(path);
  if (!text) {
    return null;
  }

  try {
    const value = type === 'json' ? JSON.parse(text) : YAML.parse(text);
    return isPlainObject(value)
      ? { json: value as JsonRecord, text, type }
      : null;
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
