import type { Matcher } from './Matcher';
import { any, type AnyConstructorName } from './matchers/any';
import { anything } from './matchers/anything';

type MatcherFactory = (args: string[]) => Matcher;

const matcherRegistry: Record<string, MatcherFactory> = {
  anything: (args: string[]) => {
    if (args.length) {
      throw new Error('anything() does not have arguments');
    }
    return anything();
  },

  any: (args: string[]) => {
    if (!args.length || args.length > 1) {
      throw new Error('any() expects exactly 1 argument, e.g. any(String)');
    }

    return any(args[0] as AnyConstructorName);
  },
};

export function parseMatcher(raw: string): Matcher | null {
  const matchedPattern = raw.match(/^\s*\{\{\s*(.+?)\s*\}\}\s*$/);
  if (!matchedPattern) {
    return null;
  }

  const matchedExpression = matchedPattern[1].match(
    /^([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*)\)$/,
  );
  if (!matchedExpression) {
    return null;
  }

  const [, name, argumentsSourceRaw] = matchedExpression;
  const factory = matcherRegistry[name];
  if (!factory) {
    return null;
  }

  const argumentsSource = argumentsSourceRaw.trim();

  const args =
    argumentsSource === '' ? [] : argumentsSource.split(',').map(s => s.trim());

  try {
    return factory(args);
  } catch {
    return null;
  }
}
