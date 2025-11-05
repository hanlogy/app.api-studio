import {
  AppError,
  type Workspace,
  type WorkspaceResources,
} from '@/definitions';
import { resolveWorkspace } from '@/lib';
import { loadWorkspace } from '@/repositories/loadWorkspace';
import { useEffect, useState } from 'react';

export const useWorkspace = () => {
  const [dir, setWorkspaceDir] = useState<string>();
  const [sources, setSources] = useState<WorkspaceResources>();
  const [environmentName, selectEnvironment] = useState<string>();
  const [error, setError] = useState<AppError>();
  const [workspace, setWorkspace] = useState<Workspace>();

  // when workspace dir changed.
  useEffect(() => {
    if (!dir) {
      return;
    }

    loadWorkspace({ dir, onData: setSources, onError: setError });
  }, [dir]);

  // when sources or environmentName changed.
  useEffect(() => {
    if (!dir || !sources) {
      return;
    }

    const resolved = resolveWorkspace({
      sources,
      environmentName,
    });

    if (!resolved) {
      setError(
        new AppError({
          code: 'parseWorkspaceFailed',
          message: 'Failed to parse workspace files',
        }),
      );
      return;
    }

    setError(undefined);
    setWorkspace({ ...resolved, dir });
  }, [sources, environmentName, dir]);

  return { setWorkspaceDir, selectEnvironment, workspace, error };
};
