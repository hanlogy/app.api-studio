import {
  type ApiResource,
  type CollectionResource,
  type JsonValue,
  type ValuesMap,
} from '@/definitions';
import {isPlainObject} from '@/helpers/checkTypes';
import {resolveValuesMap} from './resolveValuesMap';
import {pickDefinedString, removeUndefined} from '@/helpers/filterValues';
import {resolveApiResource} from './resolveApiResource';
import {resolveStringRecord, resolveUrl} from './simpleResolvers';

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

  const {name, baseUrl, description, headers, apis = [], ...rest} = source;

  const localValuesMap = resolveValuesMap({
    source: rest,
    valuesMap: externalValuesMap,
  });

  const valuesMap = {...externalValuesMap, ...(localValuesMap ?? {})};

  return removeUndefined({
    name: pickDefinedString(name),
    description: pickDefinedString(description),
    baseUrl: resolveUrl({source: baseUrl, valuesMap}),
    headers: resolveStringRecord({source: headers, valuesMap}),
    valuesMap: localValuesMap,
    apis: resolveApis({source: apis, valuesMap}),
  });
}

function resolveApis({
  source,
  valuesMap,
}: {
  source: JsonValue;
  valuesMap: ValuesMap;
}): ApiResource[] {
  if (!source || !Array.isArray(source)) {
    return [];
  }

  return source
    .map(item => resolveApiResource({source: item, valuesMap}))
    .filter(e => e !== undefined);
}
