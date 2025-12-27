import type { ApiStudioProject } from './types';

export function getWatchedPaths(project: ApiStudioProject): string[] {
  const set = new Set<string>();
  set.add(project.configPath);
  set.add(project.entryPath);

  for (const p of project.overlaysPaths) {
    set.add(p);
  }

  for (const doc of project.docs.values()) {
    set.add(doc.path);
    for (const refPath of doc.externalRefs) {
      set.add(refPath);
    }
  }

  return [...set];
}
