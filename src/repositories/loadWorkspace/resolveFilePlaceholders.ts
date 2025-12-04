import RNFS from 'react-native-fs';
import type { JsonRecord, JsonValue } from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import { resolvePath } from '@/helpers/pathHelpers';

// Only support json, txt, md
const FILE_REF_RE = /^@file:\s*(.+\.(json|txt|md))\s*$/i;

export async function resolveFilePlaceholders<T extends JsonRecord>({
  baseDir,
  content,
}: {
  // Directory where the `content` comes from.
  readonly baseDir: string;
  readonly content: T;
}): Promise<T> {
  async function resolveValue(data: JsonValue): Promise<JsonValue> {
    if (typeof data === 'string') {
      const match = FILE_REF_RE.exec(data);
      if (!match) {
        return data;
      }

      const relativePath = match[1].trim();
      const fileType = match[2].toLowerCase();

      const targetPath = resolvePath({ absoluteDir: baseDir, relativePath });

      try {
        const fileContent = await RNFS.readFile(targetPath, 'utf8');
        if (fileType === 'json') {
          return JSON.parse(fileContent) as JsonValue;
        }

        return fileContent;
      } catch {
        return data;
      }
    }

    if (Array.isArray(data)) {
      const result: JsonValue[] = [];
      for (const item of data) {
        result.push(await resolveValue(item));
      }
      return result;
    }

    if (isPlainObject(data)) {
      const entries = await Promise.all(
        Object.entries(data).map(async ([key, value]) => {
          const resolved = await resolveValue(value);
          return [key, resolved] as const;
        }),
      );

      return Object.fromEntries(entries);
    }

    return data;
  }

  const resolved = await resolveValue(content);
  return resolved as T;
}
