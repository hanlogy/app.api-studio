import type { AppError } from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import type {
  ProjectSource,
  JsonRecordDocumentWithStat,
  DepsGraph,
} from './types';

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

export function isSameDocument(
  docA?: JsonRecordDocumentWithStat,
  docB?: JsonRecordDocumentWithStat,
) {
  if (!docA || !docB) {
    return docA === docB;
  }

  return (
    docA.path === docB.path &&
    docA.mtime === docB.mtime &&
    docA.size === docB.size &&
    docA.hash === docB.hash
  );
}

export function isSameDepsGraph(depsA?: DepsGraph, depsB?: DepsGraph) {
  if (!depsA || !depsB) {
    return depsA === depsB;
  }
  if (depsA.size !== depsB.size) {
    return false;
  }

  for (const [key, depA] of depsA) {
    const depB = depsB.get(key);
    if (!depB) {
      return false;
    }

    if (depA.size !== depB.size) {
      return false;
    }
    for (const dep of depA) {
      if (!depB.has(dep)) {
        return false;
      }
    }
  }

  return true;
}

export function isSameProjectData(
  dataA: ProjectSource | null,
  dataB: ProjectSource | null,
) {
  if (!dataA || !dataB) {
    return dataA === dataB;
  }

  if (
    dataA.projectDir !== dataB.projectDir ||
    dataA.openApiDocs.size !== dataB.openApiDocs.size ||
    !isSameDocument(dataA.configDoc, dataB.configDoc)
  ) {
    return false;
  }

  for (const [path, docA] of dataA.openApiDocs) {
    if (!isSameDocument(docA, dataB.openApiDocs.get(path))) {
      return false;
    }
  }

  if (!isSameDepsGraph(dataA.reverseDeps, dataB.reverseDeps)) {
    return false;
  }

  return true;
}
