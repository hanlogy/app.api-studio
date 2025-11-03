import {type PropsWithChildren, useEffect, useMemo, useState} from 'react';
import {StudioContext} from './StudioContext';
import {useWorkspace} from './useWorkspace';
import type {StudioState, StudioStateStatus} from './types';
import {readStudioCache} from '@/repositories/studioCache';
import {type WorkspaceSummary} from '@/definitions';

export const StudioContextProvider = ({children}: PropsWithChildren<{}>) => {
  const [status, setStatus] = useState<StudioStateStatus>('initializing');
  const [workspaces, setWorkspaces] = useState<readonly WorkspaceSummary[]>();
  const [currentWorkspaceDir, setCurrentWorkspaceDir] = useState<string>();
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
    if (status === 'initializing' || !currentWorkspaceDir) {
      return;
    }

    setStatus('loading');
    setWorkspaceDir(currentWorkspaceDir);
    selectEnvironment('f');
  }, [status, currentWorkspaceDir, setWorkspaceDir, selectEnvironment]);

  useEffect(() => {
    if (!workspace) {
      return;
    }

    setStatus('ready');
  }, [workspace]);

  useEffect(() => {
    if (!workspaceError) {
      return;
    }

    setStatus('error');
  }, [workspaceError]);

  const state = useMemo<StudioState>(() => {
    if (status === 'initializing') {
      return {status};
    }

    if (status === 'waiting' && workspaces) {
      return {status, workspaces};
    }

    if (status === 'loading' && workspaces) {
      return {status, workspaces, workspace};
    }

    if (status === 'ready' && workspaces && workspace) {
      return {status, workspaces, workspace};
    }

    if (status === 'error' && workspaceError) {
      return {status, error: workspaceError, workspaces, workspace};
    }

    throw new Error('This should never happen.');
  }, [status, workspaces, workspace, workspaceError]);

  return (
    <StudioContext value={{state, openWorkspace: setCurrentWorkspaceDir}}>
      {children}
    </StudioContext>
  );
};
