import { isUrlRef } from './isUrlRef';
import type { ApiStudioProject } from './types';

// url is excluded
export function getWatchedPaths({
  configPath,
  entryPath,
  overlaysPaths,
  docs,
}: ApiStudioProject): string[] {
  const set = new Set<string>();
  set.add(configPath);
  set.add(entryPath);

  for (const path of overlaysPaths) {
    if (!isUrlRef(path)) {
      set.add(path);
    }
  }

  for (const doc of docs.values()) {
    set.add(doc.path);

    for (const path of doc.externalRefs) {
      if (!isUrlRef(path)) {
        set.add(path);
      }
    }
  }

  return [...set];
}
