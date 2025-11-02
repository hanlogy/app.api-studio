import {PropsWithChildren, useCallback, useEffect, useState} from 'react';
import {StudioContext} from './StudioContext';
import {useWorkspace} from './useWorkspace';
import {StudioState} from './types';
import {readStudioCache} from '@/repositories/studioCache';

export const StudioContextProvider = ({children}: PropsWithChildren<{}>) => {
  const [state, setState] = useState<StudioState>({status: 'initializing'});
  const {setWorkspacePath} = useWorkspace();

  // When `initializing`:
  // Load cache, change status to `waiting` when cache loaded.
  useEffect(() => {
    (async () => {
      if (state.status !== 'initializing') {
        return;
      }

      const cache = await readStudioCache();
      setState(prev => ({
        ...prev,
        status: 'waiting' as const,
        workspaces: cache?.workspaces,
      }));
    })();
  }, [state.status]);

  // When `currentWorkspacePath` changed:
  // Load workspace and update cache
  useEffect(() => {
    const currentWorkspacePath = state.currentWorkspacePath;
    if (!currentWorkspacePath) {
      return;
    }

    setState(prev => {
      return {...prev, currentWorkspacePath, status: 'loading'};
    });

    setWorkspacePath(currentWorkspacePath);
  }, [state.currentWorkspacePath, setWorkspacePath]);

  const openWorkspace = useCallback((path: string) => {
    setState(prev => ({
      ...prev,
      currentWorkspacePath: path,
    }));
  }, []);

  return (
    <StudioContext value={{state, openWorkspace}}>{children}</StudioContext>
  );
};
