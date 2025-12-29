import { AppError, type JsonRecord } from '@/definitions';
import type { JsonRecordDocument } from '@/helpers/fileIO';

/**
 * For:
 * - config file
 * - entry document
 * - overlays documents
 */
export interface JsonRecordDocumentWithStat<T extends JsonRecord = JsonRecord>
  extends JsonRecordDocument<T> {
  readonly mtime: number;
  readonly hash: string;
}

export type ConfigDocument = JsonRecordDocumentWithStat<{
  openapi: string;
  overlays: string[];
}>;

export type OpenApiDocument = JsonRecordDocumentWithStat;
