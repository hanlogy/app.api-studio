import {isPlainObject} from '@/helpers/isPlainObject';
import {RequestHeaders, ValuesMap} from '@/definitions/types';
import {resolveRecordSource} from './resolveRecordSource';

export const buildHeaders = ({
  source,
  valuesMap = {},
}: {
  source?: unknown;
  valuesMap?: ValuesMap;
} = {}): RequestHeaders => {
  if (!source || !isPlainObject(source)) {
    return {};
  }

  return resolveRecordSource({source, valuesMap, transform: String});
};
