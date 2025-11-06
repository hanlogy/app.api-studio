import {
  AppError,
  type Workspace,
  type WorkspaceResources,
} from '@/definitions';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { WorkspaceContextValue, WorkspaceStatus } from './types';
import { loadWorkspace } from '@/repositories/loadWorkspace';
import { resolveWorkspace } from '@/lib';
import { WorkspaceContext } from './context';
import { useStudioConext } from '../studio';
import type { HttpResponse } from '@/lib/sendRequest';

export function WorkspaceContextProvider({ children }: PropsWithChildren<{}>) {
  const { setError, updateRecentWorkspace } = useStudioConext();
  const [status, setStatus] = useState<WorkspaceStatus>('waiting');
  const [dir, setWorkspaceDir] = useState<string>();
  const [sources, setSources] = useState<WorkspaceResources>();
  const [openedRequestKey, openRequest] = useState<[string, string]>();
  const [environmentName, selectEnvironment] = useState<string>();
  const [workspace, setWorkspace] = useState<Workspace>();
  const [histories, setHistories] = useState<
    { key: [string, string]; items: HttpResponse[] }[]
  >([]);

  //When `dir` changed:
  //Load workspace files, parse, resolve, update cache
  useEffect(() => {
    if (!dir) {
      return;
    }

    loadWorkspace({ dir, onData: setSources, onError: setError });
  }, [dir, setWorkspaceDir, setError]);

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

    setError();
    setWorkspace({ ...resolved, dir });
  }, [sources, environmentName, dir, setError]);

  useEffect(() => {
    if (!workspace) {
      return;
    }

    setStatus('ready');
  }, [workspace]);

  // Tells studio to update recently opened
  useEffect(() => {
    if (!workspace) {
      return;
    }

    const summary = {
      name: workspace.name,
      dir: workspace.dir,
    };
    updateRecentWorkspace?.(summary);
  }, [workspace, updateRecentWorkspace]);

  const saveHistory = useCallback(
    (key: [string, string], response: HttpResponse) => {
      setHistories(prev => {
        const clone = [...prev];
        let existing = clone.find(e => {
          e.key[0] === key[0] && e.key[1] === key[1];
        });

        if (!existing) {
          existing = { key, items: [] };
          clone.push(existing);
        }

        existing.items = [response, ...existing.items].slice(0, 20);
        return clone;
      });
    },
    [],
  );

  const getHistories = useCallback(
    (key: [string, string]) => {
      return (
        histories.find(e => e.key[0] === key[0] && e.key[1] === key[1])
          ?.items ?? []
      );
    },
    [histories],
  );

  const openedRequest = useMemo(() => {
    const collections = workspace?.collections;
    if (!collections) {
      return undefined;
    }
    for (const collection of collections) {
      for (const request of collection.requests) {
        if (
          openedRequestKey &&
          request.key[0] === openedRequestKey[0] &&
          request.key[1] === openedRequestKey[1]
        ) {
          return request;
        }
      }
    }
    return undefined;
  }, [openedRequestKey, workspace?.collections]);

  const value = useMemo<WorkspaceContextValue>(() => {
    const common = {
      openedRequest,
      selectEnvironment,
      selectedEnvironment: environmentName,
      openRequest,
      openWorkspace: setWorkspaceDir,
    };

    if (status === 'waiting') {
      return { ...common, status };
    }

    if (status === 'ready' && workspace) {
      return { ...common, status, workspace, getHistories, saveHistory };
    }

    throw new Error('This should never happen.');
  }, [
    status,
    workspace,
    openedRequest,
    environmentName,
    saveHistory,
    getHistories,
  ]);

  return <WorkspaceContext value={value}>{children}</WorkspaceContext>;
}
