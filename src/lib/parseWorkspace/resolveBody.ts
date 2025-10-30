import {isPlainObject} from '@/helpers/isPlainObject';
import {resolveStringSource} from './resolveStringSource';
import type {RequestBody, ValuesMap} from '@/definitions/types';
import {StudioError} from '@/definitions';

export const resolveBody = ({
  source,
  valuesMap = {},
}: {
  source: unknown;
  valuesMap?: ValuesMap;
}): RequestBody => {
  if (source === undefined) {
    throw StudioError.invalidSource('resolveBody', source);
  }

  if (Array.isArray(source)) {
    return source.map(item => resolveBody({source: item, valuesMap}));
  }

  if (isPlainObject(source)) {
    const result: {[key: string]: RequestBody} = {};
    for (const [key, value] of Object.entries(source)) {
      result[key] = resolveBody({source: value, valuesMap});
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

  throw StudioError.invalidSource('resolveBody', source);
};
