import {
  AppError,
  type RequestResourceKey,
  type RuntimeWorkspace,
  type Workspace,
  type WorkspaceResourceKey,
  type WorkspaceResources,
} from '@/definitions';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
import { sendHttpRequest, type HttpResponse } from '@/lib/sendHttpRequest';
import { findByRequestKey } from '@/helpers/findByRequestKey';
import { selectCurrentRequest } from './selectors';
import type { HttpRequest } from '@/lib/sendHttpRequest/sendHttpRequest';
import { mergeRequestHeaders } from '@/helpers/mergeRequestHeaders';
import { loadScripts, type ScriptFunctions } from '@/repositories/loadScripts';

export function WorkspaceContextProvider({ children }: PropsWithChildren<{}>) {
  const { setError, updateRecentWorkspace } = useStudioContext();
  const [status, setStatus] = useState<WorkspaceStatus>('waiting');
  const [dir, setDir] = useState<string>();
  const [sources, setSources] = useState<WorkspaceResources>();
  const [runtimeWorkspace, setRuntimeWorkspace] = useState<RuntimeWorkspace>();
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
  const scriptFunctionsRef = useRef<ScriptFunctions>({});

  //When `dir` changed:
  //Load workspace files, parse, resolve, update cache
  useEffect(() => {
    if (!dir) {
      return;
    }

    loadWorkspace({ dir, onData: setSources, onError: setError });
    loadScripts({
      workspaceDir: dir,
      onSuccess: functions => {
        if ('requestMiddleware' in functions) {
          scriptFunctionsRef.current.requestMiddleware =
            functions.requestMiddleware;
        }
        if ('mockServerMiddleware' in functions) {
          scriptFunctionsRef.current.mockServerMiddleware =
            functions.mockServerMiddleware;
        }
      },
    });
  }, [dir, setDir, setError]);

  // when sources or selectedEnvironment changed.
  useEffect(() => {
    if (!dir || !sources) {
      return;
    }

    const resolved = resolveWorkspace({
      sources,
      environmentName: selectedEnvironment,
      runtimeWorkspace,
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
  }, [sources, selectedEnvironment, dir, setError, runtimeWorkspace]);

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
