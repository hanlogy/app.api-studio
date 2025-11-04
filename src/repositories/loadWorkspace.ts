import { WORKSPACE_COLLECTIONS_DIR, type WorkspaceFiles } from '@/definitions';
import { readJsonRecord } from '@/helpers/fileIO';

// NOTE:
// DO NOT create the config file if it does not exist, because the user might
// accidentally open the wrong folder.

export async function loadWorkspace({
  dir,
  files: { config: configFile, collections: collectionFiles },
}: {
  dir: string;
  files: WorkspaceFiles;
}) {
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
    config: configData,
    collections: collectionsData.filter(e => e !== null),
  };
}

export type LoadWorkspaceResult = Awaited<ReturnType<typeof loadWorkspace>>;
