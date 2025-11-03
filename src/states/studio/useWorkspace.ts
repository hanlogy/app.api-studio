import { AppError, type Workspace, type WorkspaceFiles } from '@/definitions';
import { resolveWorkspace, watchWorkspace, type WorkspaceWatcher } from '@/lib';
import {
  loadWorkspace,
  LoadWorkspaceResult,
} from '@/repositories/loadWorkspace';
import { useEffect, useRef, useState } from 'react';

export const useWorkspace = () => {
  const [dir, setWorkspaceDir] = useState<string>();
  const [files, setFiles] = useState<WorkspaceFiles>();
  const [sources, setSources] = useState<LoadWorkspaceResult>();
  const [environmentName, selectEnvironment] = useState<string>();
  const [error, setError] = useState<AppError>();
  const [workspace, setWorkspace] = useState<Workspace>();

  const watcherRef = useRef<WorkspaceWatcher>(null);

  // when workspace dir changed.
  useEffect(() => {
    if (!dir) {
      return;
    }

    (async () => {
      if (watcherRef.current) {
        watcherRef.current.stop();
        watcherRef.current = null;
      }

      watcherRef.current = await watchWorkspace(
        dir,
        ({ config, apis = [] }) => {
          if (!config) {
            setError(
              new AppError({
                code: 'configMissing',
                message: 'Cound not find the config file',
              }),
            );
            return;
          }

          setError(undefined);
          setFiles({ config, apis });
        },
      );
    })();
  }, [dir]);

  // when files changed
  useEffect(() => {
    if (!dir || !files) {
      return;
    }

    (async () => {
      const result = await loadWorkspace({ dir, files });

      setSources(result);
    })();
  }, [dir, files]);

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
      setError(AppError.fromCode('parseWorkspaceFailed'));
      return;
    }

    setError(undefined);
    setWorkspace({ ...resolved, dir });
  }, [sources, environmentName, dir]);

  return { setWorkspaceDir, selectEnvironment, workspace, error };
};
