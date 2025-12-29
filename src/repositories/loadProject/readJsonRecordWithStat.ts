import { AppError, type JsonRecord } from '@/definitions';
import type { JsonRecordDocumentWithStat } from './types';
import { checkFileExists, readJsonRecord, statFile } from '@/helpers/fileIO';

function fnv1a32Hex(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    h ^= input.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export async function readJsonRecordWithStat<T extends JsonRecord = JsonRecord>(
  path: string,
): Promise<JsonRecordDocumentWithStat<T>> {
  if (!(await checkFileExists(path))) {
    throw new AppError({
      code: 'fileNotExist',
      message: `File ${path} does not exists`,
      meta: { path },
    });
  }

  const [data, stat] = await Promise.all([
    readJsonRecord<T>(path),
    statFile(path),
  ]);

  return { ...data, ...stat, hash: fnv1a32Hex(data.text) };
}
