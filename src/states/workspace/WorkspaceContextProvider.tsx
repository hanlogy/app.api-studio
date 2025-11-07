import {
  AppError,
  type RequestResourceKey,
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
import type {
  OpenWorkspaceArguments,
  WorkspaceContextValue,
  WorkspaceStatus,
} from './types';
import { loadWorkspace } from '@/repositories/loadWorkspace';
import { resolveWorkspace } from '@/lib';
import { WorkspaceContext } from './context';
import { useStudioContext } from '../studio';
import type { HttpResponse } from '@/lib/sendRequest';
import { findByRequestKey } from '@/helpers/findByRequestKey';

export function WorkspaceContextProvider({ children }: PropsWithChildren<{}>) {
  const { setError, updateRecentWorkspace } = useStudioContext();
  const [status, setStatus] = useState<WorkspaceStatus>('waiting');
  const [dir, setDir] = useState<string>();
  const [sources, setSources] = useState<WorkspaceResources>();
  const [pinnedRequests, setPinnedRequests] = useState<RequestResourceKey[]>(
    [],
  );
  const [previewingRequest, setPreviewingRequest] =
    useState<RequestResourceKey>();
  const [currentRequest, setCurrentRequest] = useState<RequestResourceKey>();
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>();
  const [workspace, setWorkspace] = useState<Workspace>();
  const [histories, setHistories] = useState<
    { key: RequestResourceKey; items: HttpResponse[] }[]
  >([]);

  //When `dir` changed:
  //Load workspace files, parse, resolve, update cache
  useEffect(() => {
    if (!dir) {
      return;
    }

    loadWorkspace({ dir, onData: setSources, onError: setError });
  }, [dir, setDir, setError]);

  // when sources or selectedEnvironment changed.
  useEffect(() => {
    if (!dir || !sources) {
      return;
    }

    const resolved = resolveWorkspace({
      sources,
      environmentName: selectedEnvironment,
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
  }, [sources, selectedEnvironment, dir, setError]);

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

    const cache = {
      selectedEnvironment,
      name: workspace.name,
      dir: workspace.dir,
    };
    updateRecentWorkspace?.(cache);
  }, [workspace, updateRecentWorkspace, selectedEnvironment]);

  const saveHistory = useCallback(
    (key: RequestResourceKey, response: HttpResponse) => {
      setHistories(prev => {
        const clone = [...prev];
        let existing = findByRequestKey(clone, key);

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
    (key: RequestResourceKey) => {
      return findByRequestKey(histories, key)?.items ?? [];
    },
    [histories],
  );

  const openWorkspace = useCallback((args: OpenWorkspaceArguments) => {
    setDir(args.dir);
    if (args.environment) {
      setSelectedEnvironment(args.environment);
    }
  }, []);

  const openRequest = useCallback((key: RequestResourceKey) => {
    setCurrentRequest(key);
    setPreviewingRequest(key);
  }, []);

  const value = useMemo<WorkspaceContextValue>(() => {
    const common = {
      selectEnvironment: setSelectedEnvironment,
      selectedEnvironment,
      currentRequest,
      openRequest,
      openWorkspace,
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
    currentRequest,
    selectedEnvironment,
    saveHistory,
    getHistories,
    openWorkspace,
    openRequest,
  ]);

  return <WorkspaceContext value={value}>{children}</WorkspaceContext>;
}
