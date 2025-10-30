import {isPlainObject} from '@/helpers/isPlainObject';
import {RequestHeaders, ValuesMap} from '@/definitions/types';
import {resolveRecordSource} from './resolveRecordSource';
import {StudioError} from '@/definitions';

export const resolveHeaders = ({
  source,
  valuesMap = {},
}: {
  source: unknown;
  valuesMap?: ValuesMap;
}): RequestHeaders => {
  if (!isPlainObject(source)) {
    throw StudioError.invalidSource('resolveHeaders', source);
  }

  return resolveRecordSource({source, valuesMap, transform: String});
};
