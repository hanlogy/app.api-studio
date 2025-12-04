import { isPlainObject } from '@/helpers/checkTypes';
import { isMatcher } from './isMatcher';
import type { Pattern } from './definitions';

export function matchValue(actual: unknown, pattern: Pattern): boolean {
  if (isMatcher(pattern)) {
    return pattern.test(actual);
  }

  if (Array.isArray(pattern)) {
    if (!Array.isArray(actual)) {
      return false;
    }

    if (pattern.length === 0) {
      return true;
    }

    if (actual.length < pattern.length) {
      return false;
    }

    for (let i = 0; i < pattern.length; i++) {
      if (!matchValue(actual[i], pattern[i])) {
        return false;
      }
    }
    return true;
  }

  if (isPlainObject(pattern)) {
    const entries = Object.entries(pattern as Record<string, Pattern>);

    if (entries.length === 0) {
      return true;
    }

    if (!isPlainObject(actual)) {
      return false;
    }

    const a = actual as Record<string, unknown>;

    for (const [key, subPattern] of entries) {
      if (!matchValue(a[key], subPattern)) {
        return false;
      }
    }
    return true;
  }

  return Object.is(pattern, actual);
}
