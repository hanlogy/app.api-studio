import {PropsWithChildren, useCallback, useEffect, useState} from 'react';
import {StudioContext} from './StudioContext';
import {StudioState} from './types';
import {fetchStudioState} from './repository';

export const StudioContextProvider = ({children}: PropsWithChildren<{}>) => {
  const [state, setState] = useState<StudioState>({status: 'initializing'});

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

    (async () => {
      //
    })();
  }, [state.currentWorkspacePath]);

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
