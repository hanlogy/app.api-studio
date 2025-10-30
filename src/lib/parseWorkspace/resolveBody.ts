import {isPlainObject} from '@/helpers/isPlainObject';
import {resolveStringSource} from './resolveStringSource';
import type {RequestBody, ValuesMap} from '@/definitions/types';

export const resolveBody = ({
  source,
  valuesMap = {},
}: {
  source?: unknown;
  valuesMap?: ValuesMap;
} = {}): RequestBody | undefined => {
  if (source === undefined) {
    return undefined;
  }

  if (Array.isArray(source)) {
    return source.map(item => {
      const resolved = resolveBody({source: item, valuesMap});
      return resolved === undefined ? null : resolved;
    });
  }

  if (isPlainObject(source)) {
    const result: {[key: string]: RequestBody} = {};
    for (const [key, value] of Object.entries(source)) {
      const resolved = resolveBody({source: value, valuesMap});
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
