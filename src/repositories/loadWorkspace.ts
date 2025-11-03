import { WORKSPACE_APIS_DIR, WorkspaceFiles } from '@/definitions';
import { readJsonRecord } from '@/helpers/fileIO';

// NOTE:
// DO NOT create the config file if it does not exist, because the user might
// accidentally open the wrong folder.

export async function loadWorkspace({
  dir,
  files: { config: configFile, apis: apiFiles },
}: {
  dir: string;
  files: WorkspaceFiles;
}) {
  dir = dir.replace(/\/$/, '');

  const configData = await readJsonRecord({
    dir,
    file: configFile,
  });

  const apisData = await Promise.all(
    apiFiles.map(async apiFile =>
      readJsonRecord({
        dir: [dir, WORKSPACE_APIS_DIR].join('/'),
        file: apiFile,
      }),
    ),
  );

  return {
    config: configData,
    apis: apisData.filter(e => e !== null),
  };
}

export type LoadWorkspaceResult = Awaited<ReturnType<typeof loadWorkspace>>;
