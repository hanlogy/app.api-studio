import {AppError, Workspace} from '@/definitions';
import {watchWorkspace, type WorkspaceWatcher} from '@/lib';
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
      const data = await loadWorkspace({
        workspacePath: path,
        ...files,
      });
      console.log(data);
      // TOOD: Resolve data
    })();
  }, [files, path]);

  return {setWorkspacePath, selectEnvironment, workspace, error};
};
