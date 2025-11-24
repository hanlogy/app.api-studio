import type { RequestKey } from '@/definitions';

export function findByRequestKey<T extends { key: RequestKey }>(
  source: readonly T[],
  key?: RequestKey,
): T | undefined {
  if (!key || !source.length) {
    return undefined;
  }

  return source.find(e => e.key[0] === key[0] && e.key[1] === key[1]);
}
