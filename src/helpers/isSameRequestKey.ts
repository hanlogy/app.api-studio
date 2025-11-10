import type { RequestResourceKey } from '@/definitions';

export function isSameRequestKey(
  key1: RequestResourceKey,
  key2: RequestResourceKey,
) {
  return key1[0] === key2[0] && key1[1] === key2[1];
}
