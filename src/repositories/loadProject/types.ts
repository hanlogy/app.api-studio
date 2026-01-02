import { type JsonRecord } from '@/definitions';
import type { JsonRecordDocument } from '@/helpers/fileIO';

export interface JsonRecordDocumentWithStat<T extends JsonRecord = JsonRecord>
  extends JsonRecordDocument<T> {
  readonly mtime: number;
  readonly size: number;
  readonly hash: string;
}

export type ConfigDocument = JsonRecordDocumentWithStat<{
  readonly openapi: string;
  readonly overlays: readonly string[];
}>;

export type OpenApiDocument = JsonRecordDocumentWithStat;

export type DepsGraph = ReadonlyMap<string, ReadonlySet<string>>;

export interface ApiStudioProject {
  readonly projectDir: string;
  readonly configDoc: ConfigDocument;
  readonly openApiDocs: ReadonlyMap<string, OpenApiDocument>;
  readonly forwardDeps: DepsGraph;
  readonly reverseDeps: DepsGraph;
}
