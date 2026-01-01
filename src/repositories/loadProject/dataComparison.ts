import type { AppError } from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import type { ApiStudioProject } from './types';

function getPath({ meta }: AppError) {
  if (!isPlainObject(meta)) {
    return;
  }
  const { path } = meta;
  return typeof path === 'string' ? path : undefined;
}

export function isSameError(errorA: AppError | null, errorB: AppError | null) {
  if (!errorA || !errorB) {
    return errorA === errorB;
  }
  return errorA.sameAs(errorB) && getPath(errorA) === getPath(errorB);
}

export function isSameProjectData(
  dataA: ApiStudioProject | null,
  dataB: ApiStudioProject | null,
) {
  if (!dataA || !dataB) {
    return dataA === dataB;
  }

  if (
    dataA.projectDir !== dataB.projectDir ||
    dataA.configPath !== dataB.configPath ||
    dataA.entryPath !== dataB.entryPath ||
    dataA.overlayPaths.length !== dataB.overlayPaths.length ||
    dataA.overlayPaths.every(e => dataB.overlayPaths.includes(e)) === false ||
    dataA.docs.size !== dataB.docs.size ||
    dataA.reverseDeps.size !== dataB.reverseDeps.size
  ) {
    return false;
  }

  // Compare docs: only mtime + hash for each path
  for (const [path, docA] of dataA.docs) {
    const docB = dataB.docs.get(path);
    if (!docB) {
      return false;
    }

    if (docA.mtime !== docB.mtime || docA.hash !== docB.hash) {
      return false;
    }
  }

  // Compare reverseDeps: keys + sets must match exactly
  for (const [key, depsA] of dataA.reverseDeps) {
    const depsB = dataB.reverseDeps.get(key);
    if (!depsB) {
      return false;
    }

    if (depsA.size !== depsB.size) {
      return false;
    }
    for (const dep of depsA) {
      if (!depsB.has(dep)) {
        return false;
      }
    }
  }

  return true;
}
