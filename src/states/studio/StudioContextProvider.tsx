import { type PropsWithChildren, useEffect, useMemo, useState } from 'react';
import type { StudioContextValue, StudioStateStatus } from './types';
import { readStudioCache } from '@/repositories/studioCache';
import { type WorkspaceSummary } from '@/definitions';
import { StudioContext } from './context';

export const StudioContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [status, setStatus] = useState<StudioStateStatus>('initializing');
  const [workspaces, setWorkspaces] = useState<readonly WorkspaceSummary[]>([]);

  // When `status` is `initializing`:
  // Load cache, change `status` to `ready`.
  useEffect(() => {
    (async () => {
      if (status !== 'initializing') {
        return;
      }

      const cache = await readStudioCache();
      setWorkspaces(cache?.workspaces ?? []);
      setStatus('ready');
    })();
  }, [status]);

  const value = useMemo<StudioContextValue>(() => {
    if (status === 'initializing') {
      return { status };
    }

    if (status === 'ready' && workspaces) {
      return { status, workspaces };
    }

    throw new Error('StudioContextProvider: This should never happen.');
  }, [status, workspaces]);

  return <StudioContext value={value}>{children}</StudioContext>;
};
