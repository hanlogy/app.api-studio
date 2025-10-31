/**
 * NOTE:
 * For resolving, the source is always a `JsonValue`. The user-provided config
 * is not guaranteed, so we should be as tolerant as possible.
 *
 * Also, we should always return `undefined` instead of assigning a default
 * value when the source is invalid, so the consumer can decide their own
 * defaults.
 */

import {JsonValue, type PrimitiveValue, type ValuesMap} from '@/definitions';

type ResolveArgs =
  | {
      source: JsonValue;
      valuesMap?: ValuesMap;
      lookup?: never;
    }
  | {
      source: JsonValue;
      valuesMap?: never;
      lookup?: (key: string) => PrimitiveValue | undefined;
    };

export const resolveString = ({
  source: sourceOriginal,
  valuesMap,
  lookup,
}: ResolveArgs): PrimitiveValue | undefined => {
  if (!sourceOriginal || typeof sourceOriginal !== 'string') {
    return undefined;
  }

  const source = sourceOriginal.trim();
  const pattern = '{{([^{}]+)}}';
  const singlePlaceholderMatch = source.match(new RegExp(`^${pattern}$`));

  const getValue = (key: string): PrimitiveValue | undefined => {
    key = key.trim();
    if (lookup) {
      return lookup(key);
    }
    if (valuesMap) {
      return valuesMap[key];
    }
    return undefined;
  };

  // Single placeholder: return original type if possible
  if (singlePlaceholderMatch) {
    const value = getValue(singlePlaceholderMatch[1]);
    return value === undefined ? source : value;
  }

  // Multiple replacements: always return a string
  return source.replace(new RegExp(pattern, 'g'), (_, key) => {
    const value = getValue(key);
    return value === undefined ? `{{${key}}}` : String(value);
  });
};
