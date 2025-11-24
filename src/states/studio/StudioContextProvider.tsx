import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  StudioContextValue,
  StudioStateStatus,
  WorkspaceCache,
} from './types';
import { readStudioCache, updateStudioCache } from '@/repositories/studioCache';
import { AppError } from '@/definitions';
import { StudioContext } from './context';
import { haveWorkspaceCachesChanged } from './haveWorkspaceCachesChanged';

export const StudioContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [status, setStatus] = useState<StudioStateStatus>('initializing');
  const [error, setError] = useState<AppError | undefined>();
  const [workspaces, setWorkspaces] = useState<readonly WorkspaceCache[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<{
    dir: string;
    environment?: string;
  }>();

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
    (workspace: WorkspaceCache) => {
      const updatedWorkspaces = workspaces.filter(
        ({ dir }) => dir !== workspace.dir,
      );

      updatedWorkspaces.unshift({
        name: workspace.name,
        dir: workspace.dir,
        selectedEnvironment: workspace.selectedEnvironment,
      });

      if (haveWorkspaceCachesChanged(updatedWorkspaces, workspaces)) {
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
      return {
        ...common,
        status,
        workspaces,
        currentWorkspace,
        updateRecentWorkspace,
        setCurrentWorkspace,
      };
    }

    throw new Error('StudioContextProvider: This should never happen.');
  }, [status, workspaces, updateRecentWorkspace, error, currentWorkspace]);

  return <StudioContext value={value}>{children}</StudioContext>;
};
