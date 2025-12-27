import type { OpenApiDocument, ReverseDeps } from './types';

export function buildReverseDeps<
  T extends Pick<OpenApiDocument, 'externalRefs' | 'path'>,
>(docs: Map<string, T>): ReverseDeps {
  const tmp = new Map<string, Set<string>>();

  for (const doc of docs.values()) {
    for (const target of doc.externalRefs) {
      const set = tmp.get(target) ?? new Set<string>();
      set.add(doc.path);
      tmp.set(target, set);
    }
  }

  const out: ReverseDeps = new Map();
  for (const [key, set] of tmp.entries()) {
    out.set(key, [...set].sort());
  }

  return out;
}
