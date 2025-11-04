import { type PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { StudioContext } from './StudioContext';
import { useWorkspace } from './useWorkspace';
import type { StudioState, StudioStateStatus } from './types';
import { readStudioCache, updateStudioCache } from '@/repositories/studioCache';
import { type WorkspaceSummary } from '@/definitions';
import { haveWorkspaceSummariesChanged } from './haveWorkspaceSummariesChanged';

export const StudioContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [status, setStatus] = useState<StudioStateStatus>('initializing');
  const [workspaces, setWorkspaces] = useState<readonly WorkspaceSummary[]>([]);
  const [currentWorkspaceDir, setCurrentWorkspaceDir] = useState<string>();
  const [openedRequestKey, openRequest] = useState<string>();
  const {
    setWorkspaceDir,
    workspace,
    error: workspaceError,
    selectEnvironment,
  } = useWorkspace();

  // When `status` is `initializing`:
  // Load cache, change `status` to `waiting`.
  useEffect(() => {
    (async () => {
      if (status !== 'initializing') {
        return;
      }

      const cache = await readStudioCache();
      setWorkspaces(cache?.workspaces ?? []);
      setStatus('waiting');
    })();
  }, [status]);

  // When `currentWorkspaceDir` changed:
  // Load workspace files, parse, resolve, update cache
  useEffect(() => {
    if (!currentWorkspaceDir) {
      return;
    }

    setStatus('loading');
    setWorkspaceDir(currentWorkspaceDir);
  }, [currentWorkspaceDir, setWorkspaceDir]);

  useEffect(() => {
    if (!workspace) {
      return;
    }

    setStatus('ready');
  }, [workspace]);

  useEffect(() => {
    if (!workspace) {
      return;
    }

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
  }, [workspace, workspaces]);

  useEffect(() => {
    if (!workspaceError) {
      return;
    }

    setStatus('error');
  }, [workspaceError]);

  const state = useMemo<StudioState>(() => {
    if (status === 'initializing') {
      return { status };
    }

    if (status === 'waiting' && workspaces) {
      return { status, workspaces };
    }

    if (status === 'loading' && workspaces) {
      return { status, workspaces, workspace };
    }

    if (status === 'ready' && workspaces && workspace) {
      return { status, workspaces, workspace };
    }

    if (status === 'error' && workspaceError) {
      return { status, error: workspaceError, workspaces, workspace };
    }

    throw new Error('This should never happen.');
  }, [status, workspaces, workspace, workspaceError]);

  const openedRequest = useMemo(() => {
    const collections = workspace?.collections;
    if (!collections) {
      return undefined;
    }
    for (const collection of collections) {
      for (const request of collection.requests) {
        if (request.key === openedRequestKey) {
          return request;
        }
      }
    }
    return undefined;
  }, [openedRequestKey, workspace?.collections]);

  return (
    <StudioContext
      value={{
        state,
        openWorkspace: setCurrentWorkspaceDir,
        openedRequest,
        openRequest,
        selectEnvironment,
      }}>
      {children}
    </StudioContext>
  );
};
