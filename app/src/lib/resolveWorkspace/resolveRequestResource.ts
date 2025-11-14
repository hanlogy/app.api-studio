import {
  type ValuesMap,
  type RequestResource,
  type JsonValue,
  type RequestMethod,
  requestMethods,
} from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import { resolveValuesMap } from './resolveValuesMap';
import { resolveJsonValue } from './resolveJsonValue';
import { pickWhenString, removeUndefined } from '@/helpers/filterValues';
import { resolvedOrder, resolveStringRecord } from './simpleResolvers';
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
}): RequestResource | undefined {
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
    order: resolvedOrder(order),
    description: pickWhenString(description),
    url: resolveUrl({ source: url, valuesMap, baseUrl, query: resolvedQuery }),
    method: resolveMethod({ source: method }),
    headers: resolveStringRecord({ source: headers, valuesMap }),
    query: resolvedQuery,
    body: resolveJsonValue({ source: body, valuesMap }),
    valuesMap: localValuesMap,
  });
}

function resolveMethod({
  source,
}: {
  source: JsonValue;
}): RequestMethod | undefined {
  if (!source || typeof source !== 'string') {
    return undefined;
  }

  source = source.toUpperCase();

  if (requestMethods.some(e => e === source)) {
    return source as RequestMethod;
  }
  return undefined;
}
