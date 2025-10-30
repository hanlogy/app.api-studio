import {PrimitiveRecord, Variables} from '@/definitions';
import {resolveStringRecord} from './resolveStringRecord';
import {resolveVariablePlaceholders} from './resolveVariablePlaceholders';

export const buildUrl = ({
  url: localUrl,
  baseUrl,
  query = {},
  variables = {},
}: {
  url?: string;
  baseUrl?: string;
  query?: PrimitiveRecord;
  variables?: Variables;
} = {}) => {
  const resolvedQuery = resolveStringRecord(query, variables);

  const queryString = Object.entries(resolvedQuery)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join('&');

  let mergedUrl = [baseUrl, localUrl]
    .filter(Boolean)
    .map(e => e?.replace(/\/*$/, ''))
    .join('/');

  if (mergedUrl) {
    mergedUrl = String(resolveVariablePlaceholders(mergedUrl, variables));
  }

  const [path, existingQueryString] = mergedUrl.split('?', 2);
  const fullQuery = [existingQueryString, queryString]
    .filter(Boolean)
    .join('&');

  return fullQuery ? `${path}?${fullQuery}` : path;
};
