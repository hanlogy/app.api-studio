/**
 * NOTE:
 * For resolving, the source is always a `JsonValue`. The user-provided config
 * is not guaranteed, so we should be as tolerant as possible.
 *
 * Also, we should always return `undefined` instead of assigning a default
 * value when the source is invalid, so the consumer can decide their own
 * defaults.
 */

import {
  type JsonValue,
  type PrimitiveRecord,
  type PrimitiveValue,
  type ValuesMap,
} from '@/definitions';
import {resolveString} from './resolveString';
import {isPlainObject} from '@/helpers/isPlainObject';

type ArgBase<T> = {
  valuesMap?: ValuesMap;
  transform?: (value: PrimitiveValue) => T;
};

export function resolvePrimitiveRecord<T extends PrimitiveValue>(
  args: ArgBase<T> & {source: PrimitiveRecord},
): PrimitiveRecord<T>;

export function resolvePrimitiveRecord<T extends PrimitiveValue>(
  args: ArgBase<T> & {source: Exclude<JsonValue, PrimitiveRecord>},
): undefined;

export function resolvePrimitiveRecord<T extends PrimitiveValue>({
  source,
  valuesMap = {},
  transform,
}: ArgBase<T> & {
  source: JsonValue;
}): PrimitiveRecord<T> | undefined {
  if (!isPlainObject(source)) {
    return undefined;
  }

  const items = Object.entries(source)
    .filter(([_, value]) => value !== undefined)
    .map(([name, value]) => {
      const resolved = resolveString({
        source: String(value),
        valuesMap,
      });
      return [name, transform ? transform(resolved) : resolved];
    });

  return Object.fromEntries(items);
}
