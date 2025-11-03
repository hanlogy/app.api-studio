import type { JsonValue, PrimitiveRecord, ValuesMap } from '@/definitions';
import { resolveString } from './resolveString';
import { resolvePrimitiveRecord } from './resolvePrimitiveRecord';

export function resolveUrl({
  source,
  valuesMap,
}: {
  source: JsonValue;
  valuesMap?: ValuesMap;
}): string | undefined {
  if (typeof source !== 'string') {
    return undefined;
  }

  return String(resolveString({ source, valuesMap }));
}

export function resolveStringRecord(args: {
  source: JsonValue;
  valuesMap?: ValuesMap;
}): PrimitiveRecord<string> | undefined {
  return resolvePrimitiveRecord({
    ...args,
    transform: String,
  });
}
