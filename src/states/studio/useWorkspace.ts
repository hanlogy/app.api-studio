import {useEffect, useRef, useState} from 'react';
import {watchWorkspace, type WorkspaceWatcher} from './watchWorkspace';

export const useWorkspace = () => {
  const [workspacePath, setWorkspacePath] = useState<string>();
  const watcherRef = useRef<WorkspaceWatcher>(null);

  useEffect(() => {
    if (!workspacePath) {
      return;
    }

    (async () => {
      if (watcherRef.current) {
        watcherRef.current.stop();
        watcherRef.current = null;
      }

      watcherRef.current = await watchWorkspace(workspacePath, snapshot => {
        console.log(snapshot);
      });
    })();
  }, [workspacePath]);

  return {setWorkspacePath};
};
