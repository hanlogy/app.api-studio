import {
  type ValuesMap,
  type ApiResource,
  type JsonValue,
  RequestMethod,
  requestMethods,
  PrimitiveRecord,
} from '@/definitions';
import {isPlainObject} from '@/helpers/checkTypes';
import {resolveString} from './resolveString';
import {resolveValuesMap} from './resolveValuesMap';
import {resolvePrimitiveRecord} from './resolvePrimitiveRecord';
import {resolveJsonValue} from './resolveJsonValue';
import {pickDefinedString, removeUndefined} from '@/helpers/filterValues';

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

  const {id, name, description, url, method, headers, query, body, ...rest} =
    source;

  const localValuesMap = resolveValuesMap({
    source: rest,
    valuesMap: externalValuesMap,
  });

  const valuesMap = {...externalValuesMap, ...(localValuesMap ?? {})};

  const result = {
    id: pickDefinedString(id),
    name: pickDefinedString(name),
    description: pickDefinedString(description),
    url: resolveUrl({source: url, valuesMap}),
    method: resolveMethod({source: method}),
    headers: resolveStringRecord({source: headers, valuesMap}),
    query: resolveStringRecord({source: query, valuesMap}),
    body: resolveJsonValue({source: body, valuesMap}),
  };

  return removeUndefined(result);
}

function resolveUrl({
  source,
  valuesMap,
}: {
  source: JsonValue;
  valuesMap?: ValuesMap;
}): string | undefined {
  if (typeof source !== 'string') {
    return undefined;
  }

  return String(resolveString({source, valuesMap}));
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

function resolveStringRecord(args: {
  source: JsonValue;
  valuesMap?: ValuesMap;
}): PrimitiveRecord<string> | undefined {
  return resolvePrimitiveRecord({
    ...args,
    transform: String,
  });
}
