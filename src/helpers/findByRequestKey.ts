import type { RequestResourceKey } from '@/definitions';

export function findByRequestKey<T extends { key: RequestResourceKey }>(
  source: readonly T[],
  key?: RequestResourceKey,
): T | undefined {
  if (!key || !source.length) {
    return undefined;
  }

  return source.find(e => e.key[0] === key[0] && e.key[1] === key[1]);
}
