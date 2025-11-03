import {WorkspaceSummary} from '@/definitions';

export function haveWorkspaceSummariesChanged(
  itemsA: readonly WorkspaceSummary[],
  itemsB: readonly WorkspaceSummary[],
) {
  if (itemsA.length !== itemsB.length) {
    return true;
  }

  for (const index in itemsA) {
    const {name: nameA, environmentName: environmentNameA} = itemsA[index];
    const {name: nameB, environmentName: environmentNameB} = itemsB[index];

    if (nameA !== nameB || environmentNameA !== environmentNameB) {
      return true;
    }
  }

  return false;
}
