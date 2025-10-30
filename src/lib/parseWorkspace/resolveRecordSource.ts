import {StudioError, type PrimitiveType, type ValuesMap} from '@/definitions';
import {resolveStringSource} from './resolveStringSource';
import {isPlainObject} from '@/helpers/isPlainObject';

export const resolveRecordSource = <T extends PrimitiveType>({
  source,
  valuesMap = {},
  transform,
}: {
  source: Record<string, unknown>;
  valuesMap?: ValuesMap;
  transform?: (value: PrimitiveType) => T;
}): Record<string, T> => {
  if (!isPlainObject(source)) {
    throw StudioError.invalidSource('resolveRecordSource', source);
  }

  const items = Object.entries(source)
    .filter(([_, value]) => value !== undefined)
    .map(([name, value]) => {
      const resolved = resolveStringSource({
        source: String(value),
        valuesMap,
      });
      return [name, transform ? transform(resolved) : resolved];
    });

  return Object.fromEntries(items);
};
