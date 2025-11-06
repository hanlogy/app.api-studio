import type { JsonValue, PrimitiveRecord, ValuesMap } from '@/definitions';
import { resolveString } from './resolveString';
import { buildUrl } from '@/helpers/buildUrl';

export function resolveUrl({
  source,
  baseUrl,
  query,
  valuesMap,
}: {
  source: JsonValue;
  baseUrl?: string;
  query?: PrimitiveRecord<string>;
  valuesMap?: ValuesMap;
}): string | undefined {
  const url = resolveString({ source: source, valuesMap });
  if (!url && url !== '') {
    return undefined;
  }

  return buildUrl({ baseUrl, url: String(url), query });
}
