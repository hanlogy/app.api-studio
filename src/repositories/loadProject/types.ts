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

