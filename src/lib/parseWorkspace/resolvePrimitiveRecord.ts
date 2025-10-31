import {
  PrimitiveRecord,
  type PrimitiveValue,
  type ValuesMap,
} from '@/definitions';
import {resolveString} from './resolveString';

export const resolvePrimitiveRecord = <T extends PrimitiveValue>({
  source,
  valuesMap = {},
  transform,
}: {
  source: PrimitiveRecord;
  valuesMap?: ValuesMap;
  transform?: (value: PrimitiveValue) => T;
}): PrimitiveRecord<T> => {
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
};
