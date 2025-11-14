import { AppError, type WorkspaceResources } from '@/definitions';
import { scanWorkspace, type ScanWorkspaceResult } from './scanWorkspace';
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
  let snapshot: ScanWorkspaceResult['timestamps'] | undefined;

  const scanAndRead = async () => {
    const {
      timestamps,
      files: { config: configFile, ...otherFiles },
    } = await scanWorkspace(dir);

    if (!configFile) {
      onError(
        new AppError({
          code: 'configMissing',
          message: 'Cound not find the config file',
        }),
      );

      return;
    }

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
