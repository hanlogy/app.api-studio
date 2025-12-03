import type { MockServerCase, MockServerRoute } from '@/definitions';
import type { ServerRequest, ServerResponse } from './definitions';
import { matchRoute } from './matchRoute';
import { createTextResponse } from './createResponses';
import { matchRequestCase } from './matchRequestCase';
import { forwardRequest } from './forwardRequest';

type ProcessResult = {
  response: ServerResponse;
  delay?: number;
};

export async function processRequest({
  request: requestWithoutParams,
  routes,
  globalHeaders = {},
}: {
  readonly request: ServerRequest;
  readonly routes: readonly MockServerRoute[];
  readonly globalHeaders?: Record<string, string>;
}): Promise<ProcessResult> {
  const { method, rawPath, path } = requestWithoutParams;
  const match = matchRoute(routes, { method, path });

  if (!match) {
    return {
      response: createTextResponse({
        status: 404,
        body: `No mock route for ${method} ${rawPath}`,
      }),
    };
  }

  const { route, pathParams } = match;
  const request = { ...requestWithoutParams, pathParams };

  // cases: top to bottom, first matched wins
  let selectedCase: MockServerCase | undefined;
  for (const requestCase of route.cases) {
    if (
      matchRequestCase({
        requestPattern: requestCase.request,
        request,
      })
    ) {
      selectedCase = requestCase;
      break;
    }
  }

  if (!selectedCase) {
    return {
      response: createTextResponse({
        status: 404,
        body: `No mock case for ${method} ${rawPath}`,
      }),
    };
  }

  const delay = selectedCase.delay ?? route.delay;

  if ('forward' in selectedCase) {
    return {
      delay,
      response: await forwardRequest({
        template: selectedCase.forward,
        request,
      }),
    };
  }

  if (!('response' in selectedCase)) {
    return {
      response: createTextResponse({
        status: 500,
        body: 'Mock case has neither "response" nor "forward"',
      }),
    };
  }

  const { status, headers: responseHeaders, body } = selectedCase.response;

  let bodyText = '';
  if (body !== undefined) {
    if (typeof body === 'string') {
      bodyText = body;
    } else {
      bodyText = JSON.stringify(body);
    }
  }

  return {
    delay,
    response: {
      status,
      headers: {
        ...globalHeaders,
        ...(responseHeaders ?? {}),
      },
      body: bodyText,
    },
  };
}
