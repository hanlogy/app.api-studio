import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { StudioContextValue, StudioStateStatus } from './types';
import { readStudioCache, updateStudioCache } from '@/repositories/studioCache';
import { AppError, type WorkspaceSummary } from '@/definitions';
import { StudioContext } from './context';
import { haveWorkspaceSummariesChanged } from './haveWorkspaceSummariesChanged';

export const StudioContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [status, setStatus] = useState<StudioStateStatus>('initializing');
  const [error, setError] = useState<AppError | undefined>();
  const [workspaces, setWorkspaces] = useState<readonly WorkspaceSummary[]>([]);

  // When `status` is `initializing`:
  // Load cache, change `status` to `ready`.
  useEffect(() => {
    (async () => {
      if (status !== 'initializing') {
        return;
      }

      const cache = await readStudioCache();
      setWorkspaces(cache?.workspaces ?? []);
      setStatus('ready');
    })();
  }, [status]);

  const updateRecentWorkspace = useCallback(
    (workspace: WorkspaceSummary) => {
      const updatedWorkspaces = workspaces.filter(
        ({ dir }) => dir !== workspace.dir,
      );

      updatedWorkspaces.unshift({
        name: workspace.name,
        dir: workspace.dir,
        environmentName: workspace.environmentName,
      });

      if (haveWorkspaceSummariesChanged(updatedWorkspaces, workspaces)) {
        setWorkspaces(updatedWorkspaces);

        (async () => {
          await updateStudioCache('workspaces', updatedWorkspaces);
        })();
      }
    },
    [workspaces],
  );

  const value = useMemo<StudioContextValue>(() => {
    const common = { error, setError };

    if (status === 'initializing') {
      return { ...common, status };
    }

    if (status === 'ready' && workspaces) {
      return { ...common, status, workspaces, updateRecentWorkspace };
    }

    throw new Error('StudioContextProvider: This should never happen.');
  }, [status, workspaces, updateRecentWorkspace, error]);

  return <StudioContext value={value}>{children}</StudioContext>;
};
