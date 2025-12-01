import type { AnyConstructorName, Matcher } from './definitions';
import { any } from './matchers/any';
import { anything } from './matchers/anything';
import { stringContaining } from './matchers/stringContaining';
import { stringMatching } from './matchers/stringMatching';

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

  stringContaining: (args: string[]) => {
    if (args.length !== 1) {
      throw new Error(
        'stringContaining() expects exactly 1 argument, e.g. stringContaining("foo")',
      );
    }

    const substr = stripQuotedString(args[0]);
    return stringContaining(substr);
  },

  stringMatching: (args: string[]) => {
    if (args.length !== 1) {
      throw new Error(
        'stringMatching() expects exactly 1 argument, e.g. stringMatching(/[a-z]+/)',
      );
    }

    const source = args[0];
    if (!/^\/(.+)\/([a-z]*)$/.test(source)) {
      throw new Error(
        'stringMatching() requires a JavaScript RegExp literal, e.g. stringMatching(/[a-z]+/i)',
      );
    }

    return stringMatching(source);
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

function stripQuotedString(value: string): string {
  const isDoubleQuoted = value.startsWith('"') && value.endsWith('"');
  const isSingleQuoted = value.startsWith("'") && value.endsWith("'");

  if (!isDoubleQuoted && !isSingleQuoted) {
    throw new Error('argument must be a quoted string');
  }

  return value.slice(1, -1);
}
