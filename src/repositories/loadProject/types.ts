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
  readonly openapi: string;
  readonly overlays: readonly string[];
}>;

export type OpenApiDocument = JsonRecordDocumentWithStat;

export type ReverseDeps = ReadonlyMap<string, ReadonlySet<string>>;

export interface ApiStudioProject {
  readonly projectDir: string;
  readonly configPath: string;
  readonly entryPath: string;
  readonly overlaysPaths: readonly string[];
  // Including:
  // - config file
  // - entry document
  // - overlays documents
  readonly docs: ReadonlyMap<string, ConfigDocument | OpenApiDocument>;
  readonly reverseDeps: ReverseDeps;
}
