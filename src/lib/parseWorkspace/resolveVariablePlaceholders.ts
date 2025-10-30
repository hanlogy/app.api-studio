import {PrimitiveType, Variables} from '@/definitions';

export const resolveVariablePlaceholders = (
  rawValue: string,
  variables: Variables | ((key: string) => PrimitiveType | undefined),
): PrimitiveType => {
  rawValue = rawValue.trim();
  const pattern = '{{([^{}]+)}}';
  const singlePlaceholderMatch = rawValue.match(new RegExp(`^${pattern}$`));

  const getValue = (key: string): PrimitiveType | undefined => {
    key = key.trim();
    return typeof variables === 'function' ? variables(key) : variables[key];
  };

  // Single placeholder: return original type if possible
  if (singlePlaceholderMatch) {
    const value = getValue(singlePlaceholderMatch[1]);
    return value === undefined ? rawValue : value;
  }

  // Multiple replacements: always return a string
  return rawValue.replace(new RegExp(pattern, 'g'), (_, key) => {
    const value = getValue(key);
    return value === undefined ? `{{${key}}}` : String(value);
  });
};
