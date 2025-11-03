import {useContext} from 'react';
import {StudioContext} from './StudioContext';
import {StudioContextValue} from './types';

export const useStudioConext = () => {
  const value = useContext<StudioContextValue | null>(StudioContext);

  if (!value) {
    return {status: 'initializing'} as const;
  }

  const {state, openWorkspace} = value;
  const status = state.status;

  switch (status) {
    case 'initializing':
      return {status} as const;

    case 'waiting':
      return {status, openWorkspace} as const;

    case 'loading': {
      const {workspaces, workspace} = state;
      return {
        status,
        openWorkspace,
        workspaces,
        workspace,
      } as const;
    }

    case 'ready': {
      const {workspaces, workspace} = state;
      return {
        status,
        openWorkspace,
        workspaces,
        workspace,
      } as const;
    }
  }
};
