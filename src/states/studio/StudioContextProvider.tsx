import {PropsWithChildren, useCallback, useEffect, useState} from 'react';
import {StudioContext} from './StudioContext';
import {StudioState} from './types';
import {fetchStudioState} from './repository';
import {useWorkspace} from './useWorkspace';

export const StudioContextProvider = ({children}: PropsWithChildren<{}>) => {
  const [state, setState] = useState<StudioState>({status: 'initializing'});
  const {setWorkspacePath} = useWorkspace();

  // Load cache
  useEffect(() => {
    (async () => {
      if (state.status !== 'initializing') {
        return;
      }

      const cache = await fetchStudioState();
      if (cache) {
        setState(prev => ({...prev, ...cache}));
      } else {
        setState({status: 'waiting'});
      }
    })();
  }, [state.status]);

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
