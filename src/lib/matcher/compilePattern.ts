import type { Pattern } from './definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import { parseMatcher } from './parseMatcher';
import { isMatcher } from './isMatcher';
import type { JsonValue } from '@/definitions';

export function compilePattern(value: JsonValue | Pattern): Pattern {
  if (isMatcher(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return parseMatcher(value) ?? value;
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => compilePattern(item));
  }

  if (isPlainObject(value)) {
    const out: Record<string, Pattern> = {};
    for (const [key, v] of Object.entries(value)) {
      out[key] = compilePattern(v);
    }
    return out;
  }

  // This should unreachable
  throw new Error(`Unsupported pattern value: ${String(value)}`);
}
