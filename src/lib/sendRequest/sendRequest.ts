import type { JsonValue, RequestHeaders, RequestMethod } from '@/definitions';
import { checkBodyFormat } from './checkBodyFormat';
import { removeUndefined } from '@/helpers/filterValues';
import { encodeRequestBody } from './encodeRequestBody';

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
  const response = await fetch(
    url,
    removeUndefined({
      method,
      headers,
      body: encodeRequestBody({
        source: body,
        format: checkBodyFormat(headers),
      }),
    }),
  );

  let responseBodyFormat = checkBodyFormat(response.headers);
  let responseBody: JsonValue | ArrayBuffer;

  switch (responseBodyFormat) {
    case 'json':
      try {
        responseBody = await response.json();
      } catch {
        responseBody = await response.text();
        responseBodyFormat = 'text';
      }
      break;
    case 'html':
    case 'xml':
    case 'text':
      responseBody = await response.text();
      break;
    default:
      responseBody = await response.arrayBuffer();
  }

  return {
    bodyFormat: responseBodyFormat,
    headers: Object.fromEntries(response.headers.entries()),
    status: response.status,
    body: responseBody,
  };
}

export type HttpResponse = Awaited<ReturnType<typeof sendRequest>>;
