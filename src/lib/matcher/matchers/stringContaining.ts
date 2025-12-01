import { MATCHER, type Matcher } from '../definitions';

export function stringContaining(substr: string): Matcher {
  return {
    $$typeof: MATCHER,
    name: 'stringContaining',
    test(actual?: unknown): boolean {
      return typeof actual === 'string' && actual.includes(substr);
    },
  };
}
