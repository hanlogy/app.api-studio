import { AppError } from '@/definitions';
import type { ProjectSource } from './types';
import { isSameError, isSameProjectData } from './dataComparison';
import { buildProjectData } from './buildProjectData';

const POLL_INTERVAL_MS = 2000;
let timer: NodeJS.Timeout | null = null;

export async function loadProject({
  dir: projectDir,
  onData,
  onError,
}: {
  dir: string;
  onData: (project: ProjectSource) => void;
  onError: (error: AppError | null) => void;
}) {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  let inFlight = false;
  let lastData: ProjectSource | null = null;
  let lastError: AppError | null = null;

  const emitError = (error: AppError | null) => {
    if (isSameError(error, lastError)) {
      return;
    }

    lastError = error;
    onError(error);
  };

  const emitData = (data: ProjectSource) => {
    emitError(null);
    if (isSameProjectData(data, lastData)) {
      return;
    }
    lastData = data;
    onData(data);
  };

  const tick = async () => {
    if (inFlight) {
      return;
    }

    inFlight = true;

    try {
      const projectData = await buildProjectData({
        projectDir,
        previous: lastData,
      });
      emitData(projectData);
    } catch (e) {
      emitError(AppError.from(e));
    } finally {
      inFlight = false;
    }
  };

  await tick();
  timer = setInterval(tick, POLL_INTERVAL_MS);
}
