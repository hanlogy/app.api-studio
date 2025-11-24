/**
 * NOTE:
 * For resolving, the source is always a `JsonValue`. The user-provided data
 * is not guaranteed, so we should be as tolerant as possible.
 *
 * Also, we should always return `undefined` instead of assigning a default
 * value when the source is invalid, so the consumer can decide their own
 * defaults.
 */

import {
  type JsonValue,
  type PrimitiveValue,
  type ValuesMap,
} from '@/definitions';

type ArgBase =
  | { valuesMap?: ValuesMap; lookup?: never }
  | { valuesMap?: never; lookup?: (key: string) => PrimitiveValue | undefined };

export function resolveString(
  args: ArgBase & { source: string },
): PrimitiveValue;
export function resolveString(
  args: ArgBase & { source: JsonValue },
): PrimitiveValue | undefined;

export function resolveString({
  source: sourceOriginal,
  valuesMap,
  lookup,
}: ArgBase & { source: JsonValue }): PrimitiveValue | undefined {
  if (typeof sourceOriginal === 'number') {
    return sourceOriginal;
  }
  // Be careful:
  // Do not return undefined if the source is an empty string.
  if (typeof sourceOriginal !== 'string') {
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
}
