import {isPlainObject} from '@/helpers/isPlainObject';
import {RequestHeaders, Variables} from '@/definitions/types';
import {resolveVariablePlaceholders} from './resolveVariablePlaceholders';

export const buildHeaders = (
  data?: unknown,
  variables: Variables = {},
): RequestHeaders => {
  if (!data || !isPlainObject(data)) {
    return {};
  }

  const items = Object.entries(data)
    .filter(([_, value]) => value !== undefined)
    .map(([name, value]) => {
      const raw = String(value);
      const resolved = resolveVariablePlaceholders(raw, variables);
      return [name, String(resolved)];
    });

  return Object.fromEntries(items);
};
