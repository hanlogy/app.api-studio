import {PrimitiveType, Variables} from '@/definitions';

export const resolveVariablePlaceholders = (
  rawValue: string,
  variables: Variables,
): PrimitiveType => {
  rawValue = rawValue.trim();
  const pattern = '{{([^{}]+)}}';
  const singlePlaceholderMatch = rawValue.match(new RegExp(`^${pattern}$`));

  // Single match keeps the original value type.
  if (singlePlaceholderMatch) {
    const key = singlePlaceholderMatch[1].trim();
    return key in variables ? variables[key] : rawValue;
  }

  return rawValue.replace(new RegExp(pattern, 'g'), (_, key) => {
    key = key.trim();
    return key in variables ? String(variables[key]) : `{{${key}}}`;
  });
};
