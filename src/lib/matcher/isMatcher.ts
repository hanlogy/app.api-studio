import { isPlainObject } from '@/helpers/checkTypes';
import { MATCHER, type Matcher } from './definitions';

export function isMatcher(x: unknown): x is Matcher {
  return (
    isPlainObject(x) &&
    x.$$typeof === MATCHER &&
    typeof x.test === 'function' &&
    typeof x.name === 'string'
  );
}
