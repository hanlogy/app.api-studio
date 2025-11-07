import { findRequestFromWorkspace } from '@/helpers/findRequestFromWorkspace';
import type { WorkspaceContextValue } from './types';

export function selectOpenedRequest(value: WorkspaceContextValue) {
  const { openedRequestKey, workspace, selectedEnvironment } = value;

  if (!workspace || !openedRequestKey) {
    return undefined;
  }

  return findRequestFromWorkspace(workspace, {
    key: openedRequestKey,
    environmentName: selectedEnvironment,
  });
}
