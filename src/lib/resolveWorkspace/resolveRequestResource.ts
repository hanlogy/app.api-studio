import { type ValuesMap, type Request, type JsonValue } from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import { resolveValuesMap } from './resolveValuesMap';
import { resolveJsonValue } from './resolveJsonValue';
import { pickWhenString, removeUndefined } from '@/helpers/filterValues';
import {
  resolveOrder,
  resolveMethod,
  resolveStringRecord,
} from './simpleResolvers';
import { resolveResourceKeys } from './resolveResourceKeys';
import { resolveUrl } from './resolveUrl';

export function resolveRequestResource({
  source,
  collectionKey,
  baseUrl,
  accumulateIds,
  valuesMap: externalValuesMap = {},
}: {
  source: JsonValue;
  collectionKey: string;
  baseUrl?: string;
  accumulateIds: string[];
  valuesMap?: ValuesMap;
}): Request | undefined {
  if (!isPlainObject(source)) {
    return undefined;
  }

  const {
    id,
    name,
    order,
    description,
    url,
    method,
    headers,
    query,
    body,
    ...rest
  } = source;

  const localValuesMap = resolveValuesMap({
    source: rest,
    valuesMap: externalValuesMap,
  });

  const valuesMap = { ...externalValuesMap, ...(localValuesMap ?? {}) };
  const keys = resolveResourceKeys('request', {
    collectionKey,
    name,
    id,
    accumulateIds,
  });

  if (!keys) {
    return undefined;
  }

  const resolvedQuery = resolveStringRecord({ source: query, valuesMap });

  return removeUndefined({
    ...keys,
    order: resolveOrder(order),
    description: pickWhenString(description),
    url: resolveUrl({ source: url, valuesMap, baseUrl, query: resolvedQuery }),
    method: resolveMethod({ source: method }),
    headers: resolveStringRecord({ source: headers, valuesMap }),
    query: resolvedQuery,
    body: resolveJsonValue({ source: body, valuesMap }),
    valuesMap: localValuesMap,
  });
}
