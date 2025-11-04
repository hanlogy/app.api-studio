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
import { generateKey } from './generateKey';

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

  return removeUndefined({
    key: generateKey('collection', resolvedId),
    id: resolvedId,
    name: pickWhenString(name),
    description: pickWhenString(description),
    baseUrl: resolveUrl({ source: baseUrl, valuesMap }),
    headers: resolveStringRecord({ source: headers, valuesMap }),
    valuesMap: localValuesMap,
    requests: resolveRequests({ source: requests, valuesMap }),
  });
}

function resolveRequests({
  source,
  valuesMap,
}: {
  source: JsonValue;
  valuesMap: ValuesMap;
}): RequestResource[] {
  if (!source || !Array.isArray(source)) {
    return [];
  }

  return source
    .map(item => resolveRequestResource({ source: item, valuesMap }))
    .filter(e => e !== undefined);
}
