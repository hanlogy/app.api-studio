import { AppError } from '@/definitions';
import type { ProjectSource } from './types';
import { isSameError, isSameProjectData } from './dataComparison';
import { buildProjectData } from './buildProjectData';

const POLL_INTERVAL_MS = 2000;
let timer: NodeJS.Timeout | null = null;

export async function loadProject({
  dir,
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

  const tick = async () => {
    if (inFlight) {
      return;
    }

    inFlight = true;

    try {
      const data = await buildProjectData({ dir, previous: lastData });

      if (isSameProjectData(data, lastData)) {
        return;
      }
      lastData = data;
      onData(data);
    } catch (e) {
      const error = AppError.from(e);
      if (isSameError(error, lastError)) {
        return;
      }

      lastError = error;
      onError(error);
    } finally {
      inFlight = false;
    }
  };

  await tick();
  timer = setInterval(tick, POLL_INTERVAL_MS);
}
