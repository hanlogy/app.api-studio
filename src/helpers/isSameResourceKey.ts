import type { RequestResourceKey } from '@/definitions';

export function isSameResourceKey(
  key1: string | RequestResourceKey,
  key2: string | RequestResourceKey,
) {
  if (typeof key1 !== typeof key2) {
    return false;
  }

  if (typeof key1 === 'string') {
    return key1 === key2;
  }

  return key1[0] === key2[0] && key1[1] === key2[1];
}
