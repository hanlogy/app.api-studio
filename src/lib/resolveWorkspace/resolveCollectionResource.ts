import {
  type RequestResource,
  type CollectionResource,
  type JsonValue,
  type ValuesMap,
} from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import { resolveValuesMap } from './resolveValuesMap';
import { pickWhenString, removeUndefined } from '@/helpers/filterValues';
import { resolveRequestResource } from './resolveRequestResource';
import { resolveStringRecord } from './simpleResolvers';
import { resolveResourceKeys } from './resolveResourceKeys';
import { resolveUrl } from './resolveUrl';

export function resolveCollectionResource({
  source,
  valuesMap: externalValuesMap = {},
  accumulateIds,
}: {
  source: JsonValue;
  accumulateIds: string[];
  valuesMap?: ValuesMap;
}): CollectionResource | undefined {
  if (!isPlainObject(source)) {
    return undefined;
  }

  const {
    id,
    name,
    baseUrl,
    description,
    headers,
    requests = [],
    ...rest
  } = source;

  const localValuesMap = resolveValuesMap({
    source: rest,
    valuesMap: externalValuesMap,
  });

  const valuesMap = { ...externalValuesMap, ...(localValuesMap ?? {}) };
  const keys = resolveResourceKeys('collection', {
    name,
    id,
    accumulateIds,
  });

  if (!keys) {
    return undefined;
  }

  const resolvedBaseUrl = resolveUrl({ source: baseUrl, valuesMap });

  return removeUndefined({
    ...keys,
    description: pickWhenString(description),
    baseUrl: resolvedBaseUrl,
    headers: resolveStringRecord({ source: headers, valuesMap }),
    valuesMap: localValuesMap,
    requests: resolveRequests({
      baseUrl: resolvedBaseUrl,
      source: requests,
      valuesMap,
      collectionKey: keys.key,
    }),
  });
}

function resolveRequests({
  baseUrl,
  source,
  collectionKey,
  valuesMap,
}: {
  baseUrl?: string;
  source: JsonValue;
  collectionKey: string;
  valuesMap: ValuesMap;
}): RequestResource[] {
  if (!source || !Array.isArray(source)) {
    return [];
  }

  const accumulateIds: string[] = [];

  return source
    .map(item =>
      resolveRequestResource({
        source: item,
        valuesMap,
        collectionKey,
        accumulateIds,
        baseUrl,
      }),
    )
    .filter(e => e !== undefined);
}
