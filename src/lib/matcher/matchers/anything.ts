import { MATCHER, type Matcher } from '../definitions';

export function anything(): Matcher {
  return {
    $$typeof: MATCHER,
    name: 'anything',
    test(actual?: unknown): boolean {
      return actual !== null && actual !== undefined;
    },
  };
}
