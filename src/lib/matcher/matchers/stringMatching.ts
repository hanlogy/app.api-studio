import { MATCHER, type Matcher } from '../definitions';

function toRegExp(rawPattern: string): RegExp {
  const patternMatch = rawPattern.match(/^\/(.+)\/([a-z]*)$/);
  if (patternMatch) {
    const [, pattern, flags] = patternMatch;
    return new RegExp(pattern, flags);
  }

  return new RegExp(rawPattern);
}

export function stringMatching(pattern: string | RegExp): Matcher {
  const regExp = pattern instanceof RegExp ? pattern : toRegExp(pattern);

  return {
    $$typeof: MATCHER,
    name: 'stringMatching',
    test(actual?: unknown): boolean {
      return typeof actual === 'string' && regExp.test(actual);
    },
  };
}
