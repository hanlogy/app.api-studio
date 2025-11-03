import {type PropsWithChildren, useEffect, useMemo, useState} from 'react';
import {StudioContext} from './StudioContext';
import {useWorkspace} from './useWorkspace';
import type {StudioState, StudioStateStatus} from './types';
import {readStudioCache} from '@/repositories/studioCache';
import {type WorkspaceSummary} from '@/definitions';

export const StudioContextProvider = ({children}: PropsWithChildren<{}>) => {
  const [status, setStatus] = useState<StudioStateStatus>('initializing');
  const [workspaces, setWorkspaces] = useState<readonly WorkspaceSummary[]>();
  const [currentWorkspacePath, setCurrentWorkspacePath] = useState<string>();
  const {setWorkspacePath, workspace, error: workspaceError} = useWorkspace();

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

  // When `currentWorkspacePath` changed:
  // Load workspace files, parse, resolve, update cache
  useEffect(() => {
    if (status === 'initializing' || !currentWorkspacePath) {
      return;
    }

    setStatus('loading');
    setWorkspacePath(currentWorkspacePath);
  }, [status, currentWorkspacePath, setWorkspacePath]);

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
    <StudioContext value={{state, openWorkspace: setCurrentWorkspacePath}}>
      {children}
    </StudioContext>
  );
};
