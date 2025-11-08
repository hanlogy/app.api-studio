import {
  AppError,
  type RequestResourceKey,
  type Workspace,
  type WorkspaceResourceKey,
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
  RequestHistoryItem,
  WorkspaceContextValue,
  WorkspaceStatus,
} from './types';
import { loadWorkspace } from '@/repositories/loadWorkspace';
import { resolveWorkspace } from '@/lib';
import { WorkspaceContext } from './context';
import { useStudioContext } from '../studio';
import {
  sendRequest as sendHttpRequest,
  type HttpResponse,
} from '@/lib/sendRequest';
import { findByRequestKey } from '@/helpers/findByRequestKey';
import { selectCurrentRequest } from './selectors';
import type { HttpRequest } from '@/lib/sendRequest/sendRequest';
import { mergeRequestHeaders } from '@/helpers/mergeRequestHeaders';

export function WorkspaceContextProvider({ children }: PropsWithChildren<{}>) {
  const { setError, updateRecentWorkspace } = useStudioContext();
  const [status, setStatus] = useState<WorkspaceStatus>('waiting');
  const [dir, setDir] = useState<string>();
  const [sources, setSources] = useState<WorkspaceResources>();
  const [pinnedResources, setPinnedResources] = useState<
    WorkspaceResourceKey[]
  >([]);
  const [previewingResource, setPreviewingResource] =
    useState<WorkspaceResourceKey>();
  const [currentResource, setCurrentResource] =
    useState<WorkspaceResourceKey>();
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>();
  const [workspace, setWorkspace] = useState<Workspace>();
  const [histories, setHistories] = useState<
    {
      key: RequestResourceKey;
      items: RequestHistoryItem[];
    }[]
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
    (
      key: RequestResourceKey,
      { request, response }: { request: HttpRequest; response: HttpResponse },
    ) => {
      setHistories(prev => {
        const clone = [...prev];
        let existing = findByRequestKey(clone, key);

        if (!existing) {
          existing = { key, items: [] };
          clone.push(existing);
        }

        existing.items = [{ response, request }, ...existing.items].slice(
          0,
          20,
        );
        return clone;
      });
    },
    [],
  );

  const sendRequest = useCallback(async () => {
    const currentRequest = selectCurrentRequest({
      currentResource,
      workspace,
      selectedEnvironment,
    });
    if (!currentRequest) {
      return;
    }

    const {
      url = '',
      method = 'GET',
      body,
      headers,
      environments,
      collection,
      key,
    } = currentRequest;

    const requestParams = {
      url,
      method,
      body,
      headers: mergeRequestHeaders({ environments, collection, headers }),
    };
    const response = await sendHttpRequest(requestParams);

    saveHistory(key, { request: requestParams, response });
  }, [currentResource, workspace, selectedEnvironment, saveHistory]);

  const openWorkspace = useCallback((args: OpenWorkspaceArguments) => {
    setDir(args.dir);
    if (args.environment) {
      setSelectedEnvironment(args.environment);
    }
  }, []);

  const openResource = useCallback((key: WorkspaceResourceKey) => {
    setCurrentResource(key);
    setPreviewingResource(key);
  }, []);

  const value = useMemo<WorkspaceContextValue>(() => {
    const common = {
      selectedEnvironment,
      currentResource,
      histories,
      selectEnvironment: setSelectedEnvironment,
      openResource,
      openWorkspace,
    };

    if (status === 'waiting') {
      return { ...common, status };
    }

    if (status === 'ready' && workspace) {
      return { ...common, status, workspace, sendRequest };
    }

    throw new Error('This should never happen.');
  }, [
    status,
    workspace,
    currentResource,
    selectedEnvironment,
    sendRequest,
    histories,
    openWorkspace,
    openResource,
  ]);

  return <WorkspaceContext value={value}>{children}</WorkspaceContext>;
}
