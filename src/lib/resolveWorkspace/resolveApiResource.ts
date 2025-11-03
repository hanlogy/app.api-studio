import {
  type ValuesMap,
  type ApiResource,
  type JsonValue,
  type RequestMethod,
  requestMethods,
} from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import { resolveValuesMap } from './resolveValuesMap';
import { resolveJsonValue } from './resolveJsonValue';
import { pickWhenString, removeUndefined } from '@/helpers/filterValues';
import { resolveStringRecord, resolveUrl } from './simpleResolvers';

export function resolveApiResource({
  source,
  valuesMap: externalValuesMap = {},
}: {
  source: JsonValue;
  valuesMap?: ValuesMap;
}): ApiResource | undefined {
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

  return removeUndefined({
    id: pickWhenString(id),
    name: pickWhenString(name),
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
