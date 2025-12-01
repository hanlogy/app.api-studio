// Asymmetric matcher interface and helpers

import { isPlainObject } from '@/helpers/checkTypes';

// Brand
export const MATCHER = Symbol('mock.matcher');

export interface Matcher {
  readonly $$typeof: typeof MATCHER;
  readonly name: string;
  test(actual?: unknown): boolean;
}

export function isMatcher(x: unknown): x is Matcher {
  return (
    isPlainObject(x) &&
    x.$$typeof === MATCHER &&
    typeof x.test === 'function' &&
    typeof x.name === 'string'
  );
}
