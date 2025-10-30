import {isPlainObject} from '@/helpers/isPlainObject';
import {RequestHeaders, Variables} from '@/definitions/types';
import {resolveStringRecord} from './resolveStringRecord';

export const buildHeaders = (
  data?: unknown,
  variables: Variables = {},
): RequestHeaders => {
  if (!data || !isPlainObject(data)) {
    return {};
  }

  return resolveStringRecord(data, variables);
};
