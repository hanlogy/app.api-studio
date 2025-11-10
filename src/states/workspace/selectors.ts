import { findRequestFromWorkspace } from '@/helpers/findRequestFromWorkspace';
import type { WorkspaceContextValue } from './types';
import { findByRequestKey } from '@/helpers/findByRequestKey';

export function selectCurrentRequest(
  value: Pick<
    WorkspaceContextValue,
    'currentResourceKey' | 'workspace' | 'selectedEnvironment'
  >,
) {
  const { currentResourceKey, workspace, selectedEnvironment } = value;

  if (!workspace || !currentResourceKey || !Array.isArray(currentResourceKey)) {
    return undefined;
  }

  return findRequestFromWorkspace(workspace, {
    key: currentResourceKey,
    environmentName: selectedEnvironment,
  });
}

export function selectCurrentHistories(
  value: Pick<WorkspaceContextValue, 'currentResourceKey' | 'histories'>,
) {
  const { currentResourceKey, histories } = value;
  if (!currentResourceKey || !Array.isArray(currentResourceKey)) {
    return [];
  }

  return findByRequestKey(histories, currentResourceKey)?.items ?? [];
}
