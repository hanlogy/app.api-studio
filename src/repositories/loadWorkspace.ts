import {APIS_DIR} from '@/definitions';
import {readJsonRecord} from '@/helpers/fileIO';

// NOTE:
// DO NOT create the config file if it does not exist, because the user might
// accidentally open the wrong folder.

export async function loadWorkspace({
  workspacePath,
  config: configFile,
  apis: apiFiles,
}: {
  workspacePath: string;
  config: string;
  apis: string[];
}) {
  workspacePath = workspacePath.replace(/\/$/, '');

  const configData = await readJsonRecord({
    dir: workspacePath,
    fileName: configFile,
  });

  const apisData = await Promise.all(
    apiFiles.map(async apiFile =>
      readJsonRecord({
        dir: [workspacePath, APIS_DIR].join('/'),
        fileName: apiFile,
      }),
    ),
  );

  return {
    config: configData,
    apis: apisData.filter(e => e !== null),
  };
}
