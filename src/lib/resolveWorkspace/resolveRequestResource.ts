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
import { resolveStringRecord, resolveUrl } from './simpleResolvers';
import { resolveResourceKeys } from './resolveResourceKeys';

export function resolveRequestResource({
  source,
  collectionKey,
  accumulateIds,
  valuesMap: externalValuesMap = {},
}: {
  source: JsonValue;
  collectionKey: string;
  accumulateIds: string[];
  valuesMap?: ValuesMap;
}): RequestResource | undefined {
  if (!isPlainObject(source)) {
    return undefined;
  }

  const { id, name, description, url, method, headers, query, body, ...rest } =
    source;

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

  return removeUndefined({
    ...keys,
    description: pickWhenString(description),
    url: resolveUrl({ source: url, valuesMap }),
    method: resolveMethod({ source: method }),
    headers: resolveStringRecord({ source: headers, valuesMap }),
    query: resolveStringRecord({ source: query, valuesMap }),
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
