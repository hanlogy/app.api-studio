import {
  PrimitiveRecord,
  type PrimitiveValue,
  type ValuesMap,
} from '@/definitions';
import {resolveString} from './resolveString';
import {isPlainObject} from '@/helpers/isPlainObject';

export const resolvePrimitiveRecord = <T extends PrimitiveValue>({
  source,
  valuesMap = {},
  transform,
}: {
  source: PrimitiveRecord;
  valuesMap?: ValuesMap;
  transform?: (value: PrimitiveValue) => T;
}): PrimitiveRecord<T> => {
  if (!source || !isPlainObject(source)) {
    return {};
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
};
