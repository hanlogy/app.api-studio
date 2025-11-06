import type { WorkspaceCache } from './types';

export function haveWorkspaceCachesChanged(
  itemsA: readonly WorkspaceCache[],
  itemsB: readonly WorkspaceCache[],
) {
  if (itemsA.length !== itemsB.length) {
    return true;
  }

  for (const index in itemsA) {
    const { name: nameA, selectedEnvironment: environmentNameA } =
      itemsA[index];
    const { name: nameB, selectedEnvironment: environmentNameB } =
      itemsB[index];

    if (nameA !== nameB || environmentNameA !== environmentNameB) {
      return true;
    }
  }

  return false;
}
