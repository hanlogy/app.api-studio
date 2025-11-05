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
import {
  pickWhenString,
  removeUndefined,
  stringFromStringOrNumber,
} from '@/helpers/filterValues';
import { resolveStringRecord, resolveUrl } from './simpleResolvers';
import { resolveResourceKey } from './resolveResourceKey';

export function resolveRequestResource({
  source,
  collectionKey,
  valuesMap: externalValuesMap = {},
}: {
  source: JsonValue;
  collectionKey: string;
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
  const resolvedId = stringFromStringOrNumber(id);
  const resolvedName = stringFromStringOrNumber(name);

  return removeUndefined({
    key: resolveResourceKey('request', {
      collectionKey,
      id: resolvedId,
      name: resolvedName,
    }),
    id: resolvedId,
    name: resolvedName,
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
