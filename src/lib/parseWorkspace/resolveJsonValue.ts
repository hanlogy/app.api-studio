import {isPlainObject} from '@/helpers/isPlainObject';
import {resolveString} from './resolveString';
import type {JsonValue, ValuesMap} from '@/definitions';

export const resolveJsonValue = ({
  source,
  valuesMap = {},
}: {
  source: JsonValue;
  valuesMap?: ValuesMap;
}): JsonValue => {
  if (Array.isArray(source)) {
    return source.map(item => resolveJsonValue({source: item, valuesMap}));
  }

  if (isPlainObject(source)) {
    const result: {[key: string]: JsonValue} = {};
    for (const [key, value] of Object.entries(source)) {
      result[key] = resolveJsonValue({source: value, valuesMap});
    }

    return result;
  }

  if (typeof source === 'string') {
    return resolveString({source, valuesMap});
  }

  return source;
};
