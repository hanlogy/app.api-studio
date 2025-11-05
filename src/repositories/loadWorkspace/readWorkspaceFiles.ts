import { readJsonRecord } from '@/helpers/fileIO';
import type { WorkspaceFiles } from './types';
import {
  WORKSPACE_COLLECTIONS_DIR,
  type WorkspaceResources,
} from '@/definitions';

export async function readWorkspaceFiles({
  dir,
  files: { config: configFile, collections: collectionFiles },
}: {
  dir: string;
  files: WorkspaceFiles;
}): Promise<WorkspaceResources> {
  dir = dir.replace(/\/$/, '');

  const configData = await readJsonRecord({
    dir,
    file: configFile,
  });

  const collectionsData = await Promise.all(
    collectionFiles.map(async collectionFile =>
      readJsonRecord({
        dir: [dir, WORKSPACE_COLLECTIONS_DIR].join('/'),
        file: collectionFile,
      }),
    ),
  );

  return {
    config: configData ?? {},
    collections: collectionsData.filter(e => e !== null),
  };
}
