import {isPlainObject} from '@/helpers/isPlainObject';
import {resolveStringSource} from './resolveStringSource';
import type {JsonValue, ValuesMap} from '@/definitions';

export const resolveJsonValue = ({
  source,
  valuesMap = {},
}: {
  source: JsonValue;
  valuesMap?: ValuesMap;
}): JsonValue | undefined => {
  if (source === undefined) {
    return undefined;
  }

  if (Array.isArray(source)) {
    return source.map(item => {
      const resolved = resolveJsonValue({source: item, valuesMap});
      return resolved === undefined ? null : resolved;
    });
  }

  if (isPlainObject(source)) {
    const result: {[key: string]: JsonValue} = {};
    for (const [key, value] of Object.entries(source)) {
      const resolved = resolveJsonValue({source: value, valuesMap});
      if (resolved !== undefined) {
        result[key] = resolved;
      }
    }

    return result;
  }

  if (typeof source === 'string') {
    return resolveStringSource({source, valuesMap});
  }

  if (
    typeof source === 'number' ||
    typeof source === 'boolean' ||
    source === null
  ) {
    return source;
  }

  return undefined;
};
