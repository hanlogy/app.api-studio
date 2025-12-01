import { MATCHER, type Matcher } from '../Matcher';

type AnyTypeName = 'String' | 'Number' | 'Boolean' | 'Array' | 'Object';

type AnyCtor =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | ArrayConstructor
  | ObjectConstructor;

function toTypeName(arg: AnyTypeName | AnyCtor): AnyTypeName {
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

export function any(type: AnyTypeName | AnyCtor): Matcher {
  const typeName = toTypeName(type);

  return {
    $$typeof: MATCHER,
    name: `any(${typeName})`,
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
