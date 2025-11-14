import type { JsonValue, PrimitiveRecord, ValuesMap } from '@/definitions';
import { resolvePrimitiveRecord } from './resolvePrimitiveRecord';

export function resolveStringRecord(args: {
  source: JsonValue;
  valuesMap?: ValuesMap;
}): PrimitiveRecord<string> | undefined {
  return resolvePrimitiveRecord({
    ...args,
    transform: String,
  });
}
