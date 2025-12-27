import { AppError, type JsonRecord } from '@/definitions';
import type { JsonRecordFileType } from '@/helpers/fileIO';

export type OpenApiDocument = {
  // canonical absolute path
  path: string;
  format: JsonRecordFileType;
  text: string;
  mtime: number;
  hash: string;
  json: JsonRecord;
  // canonical absolute paths
  externalRefs: string[];
};

