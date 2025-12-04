import type { JsonValue, RequestQuery, ValuesMap } from '@/definitions';
import { resolveString } from './resolveString';
import { buildUrl } from '@/helpers/buildUrl';
import { stringFromStringOrNumber } from '@/helpers/filterValues';

export function resolveUrl({
  source,
  baseUrl,
  query,
  valuesMap,
}: {
  source: JsonValue;
  baseUrl?: string;
  query?: RequestQuery;
  valuesMap?: ValuesMap;
}): string | undefined {
  const url = stringFromStringOrNumber(
    resolveString({ source: source, valuesMap }),
  );

  if (!url && !baseUrl) {
    return undefined;
  }

  return buildUrl({ baseUrl, url, query });
}
