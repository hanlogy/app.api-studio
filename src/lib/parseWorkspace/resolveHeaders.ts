import type {PrimitiveRecord, RequestHeaders, ValuesMap} from '@/definitions';
import {resolveRecordSource} from './resolveRecordSource';

export const resolveHeaders = (
  args: {
    source?: PrimitiveRecord;
    valuesMap?: ValuesMap;
  } = {},
): RequestHeaders => {
  return resolveRecordSource({...args, transform: String});
};
