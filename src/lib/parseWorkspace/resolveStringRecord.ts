import {Variables} from '@/definitions';
import {resolveStringSource} from './resolveStringSource';

export const resolveStringRecord = (
  data: Record<string, unknown>,
  variables: Variables = {},
) => {
  const items = Object.entries(data)
    .filter(([_, value]) => value !== undefined)
    .map(([name, value]) => {
      const raw = String(value);
      const resolved = resolveStringSource(raw, variables);
      return [name, String(resolved)];
    });

  return Object.fromEntries(items);
};
