import type { JsonValue, RequestHeaders, RequestMethod } from '@/definitions';

type ResponseContentType = 'json' | 'text';

export async function sendRequest({
  method = 'GET',
  url = '',
  headers = {},
  body,
}: {
  method?: RequestMethod;
  url?: string;
  headers?: RequestHeaders;
  body?: JsonValue;
}) {
  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentTypeRaw = response.headers.get('content-type') || '';

  let responseBody;
  let contentType: ResponseContentType;

  if (contentTypeRaw.includes('application/json')) {
    responseBody = (await response.json()) as JsonValue;
    contentType = 'json';
  } else {
    responseBody = (await response.text()) as string;
    contentType = 'text';
  }

  return {
    contentType,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: responseBody,
  };
}

export type HttpResponse = Awaited<ReturnType<typeof sendRequest>>;
