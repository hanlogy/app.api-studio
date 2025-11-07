import { findRequestFromWorkspace } from '@/helpers/findRequestFromWorkspace';
import type { WorkspaceContextValue } from './types';

export function selectCurrentRequest(value: WorkspaceContextValue) {
  const { currentRequest, workspace, selectedEnvironment } = value;

  if (!workspace || !currentRequest) {
    return undefined;
  }

  return findRequestFromWorkspace(workspace, {
    key: currentRequest,
    environmentName: selectedEnvironment,
  });
}
