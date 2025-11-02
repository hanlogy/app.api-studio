import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {StudioContext} from './StudioContext';
import {useWorkspace} from './useWorkspace';
import {StudioState, StudioStateStatus} from './types';
import {readStudioCache} from '@/repositories/studioCache';
import {Workspace, WorkspaceSummary} from '@/definitions';

export const StudioContextProvider = ({children}: PropsWithChildren<{}>) => {
  const [status, setStatus] = useState<StudioStateStatus>('initializing');
  const [workspaces, setWorkspaces] = useState<readonly WorkspaceSummary[]>();
  // const [workspace, setWorkspace] = useState<Workspace>();
  const [currentWorkspacePath, setCurrentWorkspacePath] = useState<string>();
  const {setWorkspacePath, workspace} = useWorkspace();

  // When `status` is `initializing`:
  // Load cache and change `status` to `waiting`.
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
  // Load workspace and update cache
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
    // console.log({status, workspaces, workspace});

    throw new Error('It should never happen.');
  }, [status, workspaces, workspace]);

  // const [state, setState] = useState<StudioState>({status: 'initializing'});
  // const {setWorkspacePath, workspace} = useWorkspace();
  // const [currentWorkspacePath, setCurrentWorkspacePath] = useState<string>();

  // // When `state.status` is `initializing`:
  // // Load cache, change `state.status` to `waiting` when cache loaded.
  // useEffect(() => {
  //   (async () => {
  //     if (state.status !== 'initializing') {
  //       return;
  //     }

  //     const cache = await readStudioCache();
  //     setState(prev => ({
  //       ...prev,
  //       status: 'waiting' as const,
  //       workspaces: cache?.workspaces ?? [],
  //     }));
  //   })();
  // }, [state.status]);

  // useEffect(() => {
  //   if (state.status === 'initializing') {
  //     return;
  //   }

  //   setState(prev => {
  //     return {...prev, status: 'loading'};
  //   });
  // }, [state.status, currentWorkspacePath]);

  // // When `state.currentWorkspacePath` changed:
  // // Load workspace and update cache
  // useEffect(() => {
  //   const currentWorkspacePath = state.currentWorkspacePath;
  //   if (!currentWorkspacePath) {
  //     return;
  //   }

  //   setState(prev => {
  //     return {...prev, currentWorkspacePath, status: 'loading'};
  //   });

  //   setWorkspacePath(currentWorkspacePath);
  // }, [state.currentWorkspacePath, setWorkspacePath]);

  // const openWorkspace = useCallback((path: string) => {
  //   setState(prev => ({
  //     ...prev,
  //     currentWorkspacePath: path,
  //   }));
  // }, []);

  return (
    <StudioContext value={{state, openWorkspace: setCurrentWorkspacePath}}>
      {children}
    </StudioContext>
  );
};

/*
  const [status, setStatus] = useState<StudioStateStatus>();
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>();
  const [workspace, setWorkspace] = useState<Workspace>();
  const [currentWorkspacePath, setCurrentWorkspacePath] = useState<string>();
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

    throw new Error('It should never happen.');
  }, [status, workspaces, workspace]);
*/
