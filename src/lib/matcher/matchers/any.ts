import { MATCHER, type AnyConstructorName, type Matcher } from '../definitions';

type AnyConstructor =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | ArrayConstructor
  | ObjectConstructor;

function toTypeName(
  arg: AnyConstructorName | AnyConstructor,
): AnyConstructorName {
  if (typeof arg === 'string') {
    return arg;
  }

  if (arg === String) {
    return 'String';
  }

  if (arg === Number) {
    return 'Number';
  }
  if (arg === Boolean) {
    return 'Boolean';
  }
  if (arg === Array) {
    return 'Array';
  }

  return 'Object';
}

export function any(type: AnyConstructorName | AnyConstructor): Matcher {
  const typeName = toTypeName(type);

  return {
    $$typeof: MATCHER,
    name: 'any',
    test(actual: unknown): boolean {
      switch (typeName) {
        case 'String':
          return typeof actual === 'string';
        case 'Number':
          return typeof actual === 'number';
        case 'Boolean':
          return typeof actual === 'boolean';
        case 'Array':
          return Array.isArray(actual);
        case 'Object':
          return (
            actual !== null &&
            typeof actual === 'object' &&
            !Array.isArray(actual)
          );
      }
    },
  };
}
