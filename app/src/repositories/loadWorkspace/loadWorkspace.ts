import { AppError, type WorkspaceResources } from '@/definitions';
import { scanWorkspace, type Timestamps } from './scanWorkspace';
import { readWorkspaceFiles } from './readWorkspaceFiles';

// NOTE:
// DO NOT create the config file if it does not exist, because the user might
// accidentally open the wrong folder.

let timer: NodeJS.Timeout | null = null;

export async function loadWorkspace({
  dir,
  onData,
  onError,
}: {
  dir: string;
  onData: (sources: WorkspaceResources) => void;
  onError: (error: AppError) => void;
}) {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  const interval = 2000;
  let snapshot: Timestamps | undefined;

  const scanAndRead = async () => {
    const scanedResult = await scanWorkspace(dir);

    if (!scanedResult) {
      onError(
        new AppError({
          code: 'configMissing',
          message: 'Cound not find the config file',
        }),
      );

      return;
    }
    const {
      timestamps,
      files: { config: configFile, ...otherFiles },
    } = scanedResult;

    if (!snapshot || JSON.stringify(timestamps) !== JSON.stringify(snapshot)) {
      const resource = await readWorkspaceFiles({
        dir,
        files: {
          config: configFile,
          ...otherFiles,
        },
      });

      onData(resource);
      snapshot = timestamps;
    }
  };

  await scanAndRead();

  timer = setInterval(scanAndRead, interval);
}
