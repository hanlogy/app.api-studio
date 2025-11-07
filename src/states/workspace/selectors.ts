import { findRequestFromWorkspace } from '@/helpers/findRequestFromWorkspace';
import type { WorkspaceContextValue } from './types';
import { findByRequestKey } from '@/helpers/findByRequestKey';

export function selectCurrentRequest(
  value: Pick<
    WorkspaceContextValue,
    'currentResource' | 'workspace' | 'selectedEnvironment'
  >,
) {
  const { currentResource, workspace, selectedEnvironment } = value;

  if (!workspace || !currentResource || !Array.isArray(currentResource)) {
    return undefined;
  }

  return findRequestFromWorkspace(workspace, {
    key: currentResource,
    environmentName: selectedEnvironment,
  });
}

export function selectCurrentHistories(
  value: Pick<WorkspaceContextValue, 'currentResource' | 'histories'>,
) {
  const { currentResource, histories } = value;
  if (!currentResource || !Array.isArray(currentResource)) {
    return [];
  }

  return findByRequestKey(histories, currentResource)?.items ?? [];
}
