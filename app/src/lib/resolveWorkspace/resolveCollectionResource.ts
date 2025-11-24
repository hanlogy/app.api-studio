import {
  type Request,
  type Collection,
  type JsonValue,
  type ValuesMap,
} from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import { resolveValuesMap } from './resolveValuesMap';
import { pickWhenString, removeUndefined } from '@/helpers/filterValues';
import { resolveRequestResource } from './resolveRequestResource';
import { resolvedOrder, resolveStringRecord } from './simpleResolvers';
import { resolveResourceKeys } from './resolveResourceKeys';
import { resolveUrl } from './resolveUrl';
import { sortByOrder } from '@/helpers/sortByOrder';

export function resolveCollectionResource({
  source,
  valuesMap: environmentValuesMap = {},
  accumulateIds,
}: {
  readonly source: JsonValue;
  accumulateIds: string[];
  readonly valuesMap?: ValuesMap;
}): Collection | undefined {
  if (!isPlainObject(source)) {
    return undefined;
  }

  const {
    id,
    name,
    order,
    baseUrl,
    description,
    headers,
    requests = [],
    ...rest
  } = source;

  const localValuesMap = resolveValuesMap({
    source: rest,
    valuesMap: environmentValuesMap,
  });

  const valuesMap = { ...environmentValuesMap, ...(localValuesMap ?? {}) };
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
    order: resolvedOrder(order),
    description: pickWhenString(description),
    baseUrl: resolvedBaseUrl,
    headers: resolveStringRecord({ source: headers, valuesMap }),
    valuesMap: localValuesMap,
    requests: sortByOrder(
      resolveRequests({
        baseUrl: resolvedBaseUrl,
        source: requests,
        valuesMap,
        collectionKey: keys.key,
      }),
    ),
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
}): Request[] {
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
