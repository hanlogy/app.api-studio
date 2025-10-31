import {PrimitiveRecord} from '@/definitions';

export const buildUrl = ({
  url,
  baseUrl,
  query = {},
}: {
  url?: string;
  baseUrl?: string;
  query?: PrimitiveRecord<string>;
} = {}): string => {
  const queryString = Object.entries(query)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join('&');

  const mergedUrl = [baseUrl, url]
    .filter(Boolean)
    .map(e => e?.replace(/\/*$/, ''))
    .join('/');

  const [path, existingQueryString] = mergedUrl.split('?', 2);
  const fullQuery = [existingQueryString, queryString]
    .filter(Boolean)
    .join('&');

  return fullQuery ? `${path}?${fullQuery}` : path;
};
