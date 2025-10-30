import {watchWorkspace, type WorkspaceWatcher} from '@/lib';
import {useEffect, useRef, useState} from 'react';

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

      watcherRef.current = await watchWorkspace(workspacePath, files => {
        console.log(files);
      });
    })();
  }, [workspacePath]);

  return {setWorkspacePath};
};
