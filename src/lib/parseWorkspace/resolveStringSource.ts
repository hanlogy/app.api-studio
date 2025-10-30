import {type PrimitiveType, StudioError, type ValuesMap} from '@/definitions';

type ResolveArgs =
  | {
      source: string;
      valuesMap?: ValuesMap;
      lookup?: never;
    }
  | {
      source: string;
      valuesMap?: never;
      lookup?: (key: string) => PrimitiveType | undefined;
    };

export const resolveStringSource = ({
  source,
  valuesMap,
  lookup,
}: ResolveArgs): PrimitiveType => {
  if (!source || typeof source !== 'string') {
    throw new StudioError({
      code: 'invalidSource',
      message: `resolveStringSource: ${source} is not a valid string`,
    });
  }

  source = source.trim();
  const pattern = '{{([^{}]+)}}';
  const singlePlaceholderMatch = source.match(new RegExp(`^${pattern}$`));

  const getValue = (key: string): PrimitiveType | undefined => {
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
