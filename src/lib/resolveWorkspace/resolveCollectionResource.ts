import {
  type RequestResource,
  type CollectionResource,
  type JsonValue,
  type ValuesMap,
} from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import { resolveValuesMap } from './resolveValuesMap';
import {
  pickWhenString,
  stringFromStringOrNumber,
  removeUndefined,
} from '@/helpers/filterValues';
import { resolveRequestResource } from './resolveRequestResource';
import { resolveStringRecord, resolveUrl } from './simpleResolvers';
import { resolveResourceKey } from './resolveResourceKey';

export function resolveCollectionResource({
  source,
  valuesMap: externalValuesMap = {},
}: {
  source: JsonValue;
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
  const resolvedId = stringFromStringOrNumber(id);
  const resolvedName = stringFromStringOrNumber(name);
  const key = resolveResourceKey('collection', {
    id: resolvedId,
    name: resolvedName,
  });

  return removeUndefined({
    key,
    id: resolvedId,
    name: resolvedName,
    description: pickWhenString(description),
    baseUrl: resolveUrl({ source: baseUrl, valuesMap }),
    headers: resolveStringRecord({ source: headers, valuesMap }),
    valuesMap: localValuesMap,
    requests: resolveRequests({
      source: requests,
      valuesMap,
      collectionKey: key,
    }),
  });
}

function resolveRequests({
  source,
  collectionKey,
  valuesMap,
}: {
  source: JsonValue;
  collectionKey: string;
  valuesMap: ValuesMap;
}): RequestResource[] {
  if (!source || !Array.isArray(source)) {
    return [];
  }

  return source
    .map(item =>
      resolveRequestResource({ source: item, valuesMap, collectionKey }),
    )
    .filter(e => e !== undefined);
}
