import {
  AppError,
  GLOBAL_ENV_NAME,
  type PrimitiveValue,
  type RequestResourceKey,
  type RuntimeVariable,
  type Workspace,
} from '@/definitions';
import { mergeRequestHeaders } from '@/helpers/mergeRequestHeaders';
import {
  sendHttpRequest,
  type HttpRequest,
  type HttpResponse,
} from '@/lib/sendHttpRequest';
import { removeUndefined } from '@/helpers/filterValues';
import { selectCurrentRequest } from './selectors';
import { isSameResourceKey } from '@/helpers/isSameResourceKey';
import { isHttpResponse } from '@/lib/sendHttpRequest/isHttpResponse';

interface RunRequestWithMiddlewareOptions {
  readonly middleware?: Function;
  readonly requestKey: RequestResourceKey;
  readonly selectedEnvironment?: string;
  readonly workspace: Workspace;
  readonly setRuntimeVariable: (variable: RuntimeVariable) => void;
}

export type RunRequestWithMiddlewareResult = {
  readonly request: HttpRequest;
  readonly response: HttpResponse;
};

export async function runRequestWithMiddleware({
  middleware,
  requestKey,
  selectedEnvironment,
  workspace,
  setRuntimeVariable,
}: RunRequestWithMiddlewareOptions): Promise<
  RunRequestWithMiddlewareResult | undefined
> {
  const requestResource = selectCurrentRequest({
    currentResourceKey: requestKey,
    workspace,
    selectedEnvironment,
  });

  if (!requestResource) {
    return;
  }

  const {
    url = '',
    method = 'GET',
    body,
    headers,
    environments,
    collection,
  } = requestResource;

  const requestParams = removeUndefined({
    url,
    method,
    body,
    headers: mergeRequestHeaders({ environments, collection, headers }),
  });

  const sendRequest = async () => {
    return await sendHttpRequest(requestParams);
  };

  let response: HttpResponse;

  if (middleware) {
    try {
      const middlewareResponse = await middleware(requestKey, requestParams, {
        log: console.log,
        send: sendRequest,
        isKey: isSameResourceKey,
        setRequestVariable: (
          key: RequestResourceKey,
          name: string,
          value: PrimitiveValue,
        ) => {
          setRuntimeVariable({ type: 'request', key, name, value });
        },
        setCollectionVariable: (
          key: string,
          name: string,
          value: PrimitiveValue,
        ) => {
          setRuntimeVariable({ type: 'collection', key, name, value });
        },
        setEnvironmentVariable: (name: string, value: PrimitiveValue) => {
          if (!selectedEnvironment) {
            return;
          }

          setRuntimeVariable({
            type: 'environment',
            key: selectedEnvironment,
            name,
            value,
          });
        },
        setGlobalEnvironmentVariable: (name: string, value: PrimitiveValue) => {
          setRuntimeVariable({
            type: 'environment',
            key: GLOBAL_ENV_NAME,
            name,
            value,
          });
        },
      });
      if (!isHttpResponse(middlewareResponse)) {
        throw new AppError({
          code: 'invalidResponse',
          message: 'Invalid response from middleware',
        });
      }
      response = middlewareResponse;
    } catch (e) {
      if (e instanceof AppError) {
        throw e;
      }

      throw new AppError({
        code: 'runMiddlewareFailed',
        message: 'Failed to run request middleware',
      });
    }
  } else {
    response = await sendRequest();
  }

  return { request: { ...requestParams }, response };
}
