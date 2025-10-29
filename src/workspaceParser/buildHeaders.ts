import {isPlainObject} from '@/helpers/isPlainObject';
import {RequestHeaders} from '@/types/types';

export const buildHeaders = (data?: unknown): RequestHeaders => {
  if (!data || !isPlainObject(data)) {
    return {};
  }

  const items = Object.entries(data)
    .filter(([_, value]) => value !== undefined)
    .map(([name, value]) => {
      return [name, String(value)];
    });

  return Object.fromEntries(items);
};
