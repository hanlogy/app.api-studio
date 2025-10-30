import {PrimitiveRecord, ValuesMap} from '@/definitions';
import {resolveStringSource} from './resolveStringSource';
import {resolveRecordSource} from './resolveRecordSource';

export const resolveUrl = ({
  url: localUrl,
  baseUrl,
  query = {},
  valuesMap = {},
}: {
  url?: string;
  baseUrl?: string;
  query?: PrimitiveRecord;
  valuesMap?: ValuesMap;
} = {}): string => {
  const resolvedQuery = resolveRecordSource({source: query, valuesMap});

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
    mergedUrl = String(resolveStringSource({source: mergedUrl, valuesMap}));
  }

  const [path, existingQueryString] = mergedUrl.split('?', 2);
  const fullQuery = [existingQueryString, queryString]
    .filter(Boolean)
    .join('&');

  return fullQuery ? `${path}?${fullQuery}` : path;
};
