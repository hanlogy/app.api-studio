import {isPlainObject} from '../helpers/isPlainObject';
import {isPrimitive} from '../helpers/isPrimitive';
import type {Variables} from '../types/types';

export const buildVariables = (data?: unknown): Variables => {
  if (!data || !isPlainObject(data)) {
    return {};
  }

  const items = Object.entries(data)
    .map(([name, value]) => {
      if (!name.startsWith(':') || value === undefined || !isPrimitive(value)) {
        return undefined;
      }

      return [name.slice(1), value];
    })
    .filter(e => !!e);

  return Object.fromEntries(items);
};
