import {AppError, Workspace} from '@/definitions';
import {resolveWorkspace, watchWorkspace, type WorkspaceWatcher} from '@/lib';
import {loadWorkspace} from '@/repositories/loadWorkspace';
import {useEffect, useRef, useState} from 'react';
import {WorkspaceFiles} from './types';

export const useWorkspace = () => {
  const [path, setWorkspacePath] = useState<string>();
  const [environmentName, selectEnvironment] = useState<string>();
  const [error, setError] = useState<AppError>();
  const [workspace, setWorkspace] = useState<Workspace>();
  const [files, setFiles] = useState<WorkspaceFiles>();

  const watcherRef = useRef<WorkspaceWatcher>(null);

  // when path changed.
  useEffect(() => {
    if (!path) {
      return;
    }

    (async () => {
      if (watcherRef.current) {
        watcherRef.current.stop();
        watcherRef.current = null;
      }

      watcherRef.current = await watchWorkspace(path, ({config, apis = []}) => {
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
        setFiles({config, apis});
      });
    })();
  }, [path]);

  // when files changed
  useEffect(() => {
    if (!files || !path) {
      return;
    }

    (async () => {
      const source = await loadWorkspace({
        workspacePath: path,
        ...files,
      });

      const resolved = resolveWorkspace({
        source,
        environmentName,
      });
      console.log(resolved);
    })();
  }, [files, path, environmentName]);

  return {setWorkspacePath, selectEnvironment, workspace, error};
};
