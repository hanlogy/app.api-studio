import { AppError, type JsonRecord } from '@/definitions';
import type { JsonRecordFileType } from '@/helpers/fileIO';

// key = targetPath
// value = list of paths that reference it
export type ReverseDeps = Map<string, string[]>;

export interface ApiStudioProject {
  projectDir: string;
  configPath: string;
  entryPath: string;
  overlaysPaths: string[];
  docs: Map<string, OpenApiDocument>;
  reverseDeps: ReverseDeps;
}

export interface JsonRecordDocument<T extends JsonRecord = JsonRecord> {
  // canonical absolute path
  path: string;
  type: JsonRecordFileType;
  text: string;
  mtime: number;
  hash: string;
  json: T;
}

export interface OpenApiDocument extends JsonRecordDocument {
  externalRefs: string[];
}

export interface OADGraph {
  entryPath: string;
  // key = doc.path
  docs: Map<string, OpenApiDocument>;
  reverseDeps: ReverseDeps;
  errors: AppError[];
}

export interface SerializableOadGraph {
  entryPath: string;
  docs: OpenApiDocument[];
  reverseDeps: Record<string, string[]>;
  errors: AppError[];
}
