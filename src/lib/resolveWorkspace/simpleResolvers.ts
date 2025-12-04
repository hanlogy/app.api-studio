import {
  requestMethods,
  type JsonValue,
  type PrimitiveRecord,
  type RequestMethod,
  type ValuesMap,
} from '@/definitions';
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

export function resolveOrder(source?: JsonValue): number {
  if (typeof source === 'number') {
    return source;
  }

  const number = Number(source);
  if (isNaN(number)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return number;
}

// TODO: Fix the return type when there is addion
export function resolveMethod({
  source,
  addtion,
}: {
  source: JsonValue;
  addtion?: 'ALL'[];
}): RequestMethod | undefined {
  if (!source || typeof source !== 'string') {
    return undefined;
  }

  source = source.toUpperCase();

  if ([...requestMethods, ...(addtion ?? [])].some(e => e === source)) {
    return source as RequestMethod;
  }
  return undefined;
}
