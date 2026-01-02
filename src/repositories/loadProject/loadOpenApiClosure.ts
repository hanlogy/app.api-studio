import { getDirFromFilePath } from '@/helpers/pathHelpers';
import { collectExternalRefs } from './collectExternalRefs';
import type { OpenApiDocument } from './types';
import { readJsonRecordWithStat } from './readJsonRecordWithStat';

export async function loadOpenApiClosure(
  path: string,
  previous?: ReadonlyMap<string, OpenApiDocument>,
): Promise<{
  openApiDocs: Map<string, OpenApiDocument>;
  forwardDeps: Map<string, Set<string>>;
}> {
  const openApiDocs = new Map<string, OpenApiDocument>();
  /**
   * forwardDeps is a forward dependency graph (adjacency list):
   * - key   = loaded document path
   * - value = external file paths this document `$ref`s (ref targets)
   *
   * Notes:
   * - collectExternalRefs() returns only file refs (not `#...` internal refs).
   * - Targets may be missing/unreadable; they still appear so we can watch them.
   */
  const forwardDeps = new Map<string, Set<string>>();

  const queue: string[] = [path];
  const visited = new Set<string>();

  while (queue.length) {
    const currentPath = queue.shift();
    if (!currentPath || visited.has(currentPath)) {
      continue;
    }

    visited.add(currentPath);

    const doc = await readJsonRecordWithStat(
      currentPath,
      previous?.get(currentPath),
    );
    openApiDocs.set(currentPath, doc);

    const baseDir = getDirFromFilePath(currentPath);
    const refs = collectExternalRefs(doc.json, baseDir);

    forwardDeps.set(currentPath, refs);

    for (const refPath of refs) {
      if (!visited.has(refPath)) {
        queue.push(refPath);
      }
    }
  }

  return { openApiDocs, forwardDeps };
}
