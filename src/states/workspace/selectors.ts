import { useMemo } from 'react';
import { useWorkspaceContext } from './context';
import { findRequestFromWorkspace } from '@/helpers/findRequestFromWorkspace';

export function useOpenedRequestSelector() {
  const { openedRequestKey, workspace, selectedEnvironment } =
    useWorkspaceContext();

  return useMemo(() => {
    if (!workspace || !openedRequestKey) {
      return undefined;
    }

    return findRequestFromWorkspace(workspace, {
      key: openedRequestKey,
      environmentName: selectedEnvironment,
    });
  }, [openedRequestKey, workspace, selectedEnvironment]);
}
