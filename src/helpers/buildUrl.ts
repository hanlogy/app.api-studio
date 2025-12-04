import { type RequestQuery } from '@/definitions';
import { buildQueryString } from './buildQueryString';

export function buildUrl({
  url,
  baseUrl,
  query = {},
}: {
  url?: string;
  baseUrl?: string;
  query?: RequestQuery;
} = {}): string {
  const mergedUrl = [baseUrl, url]
    .filter(Boolean)
    .map(e => e?.replace(/\/*$/, ''))
    .join('/');

  const [path, existingQueryString] = mergedUrl.split('?', 2);
  const fullQuery = [existingQueryString, buildQueryString(query)]
    .filter(Boolean)
    .join('&');

  return fullQuery ? `${path}?${fullQuery}` : path;
}
