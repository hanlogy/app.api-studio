import { buildTextResponse } from './buildResponse';
import type { ServerResponse, ServerRequest } from './definitions';
import { resolveForwardUrl } from './resolveForwardUrl';

export async function forwardRequest({
  template,
  request: { headers, method, body, query, pathParams },
}: {
  readonly template: string;
  readonly request: ServerRequest;
}): Promise<ServerResponse> {
  const url = resolveForwardUrl({ template, query, pathParams });

  // Strip hop-by-hop headers
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers#hop-by-hop_headers
  // "These headers...must not be retransmitted by proxies..."
  const resolvedHeaders = { ...headers };
  delete resolvedHeaders.host;
  delete resolvedHeaders['content-length'];
  delete resolvedHeaders.connection;

  const init: RequestInit = {
    method,
    headers: resolvedHeaders,
  };

  if (method !== 'GET' && method !== 'HEAD') {
    if (typeof body === 'string') {
      init.body = body;
    } else if (body != null) {
      init.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, init);

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers),
      body: await response.text(),
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);

    return buildTextResponse({
      status: 502,
      body: `Failed to forward to ${url}: ${message}`,
    });
  }
}
