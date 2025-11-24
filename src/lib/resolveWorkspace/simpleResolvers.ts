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

export function resolvedOrder(source?: JsonValue): number {
  if (typeof source === 'number') {
    return source;
  }

  const number = Number(source);
  if (isNaN(number)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return number;
}
