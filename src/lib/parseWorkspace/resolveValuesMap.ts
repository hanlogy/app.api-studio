import {isPlainObject} from '@/helpers/isPlainObject';
import {isPrimitive} from '@/helpers/isPrimitive';
import type {ValuesMap} from '@/definitions/types';
import {resolveStringSource} from './resolveStringSource';
import {StudioError} from '@/definitions';

export const resolveValuesMap = ({
  source,
  valuesMap: externalValuesMap = {},
}: {
  source: unknown;
  valuesMap?: ValuesMap;
}): ValuesMap => {
  if (!isPlainObject(source)) {
    throw StudioError.invalidSource('resolveValuesMap', source);
  }

  const localValuesMap: ValuesMap = {};

  for (const [name, value] of Object.entries(source)) {
    if (name.startsWith(':') && isPrimitive(value)) {
      localValuesMap[name.slice(1)] = value;
    }
  }

  const resolveVar = (
    variableName: string,
    stack: string[] = [],
  ): string | number | boolean | null => {
    const value = localValuesMap[variableName];
    if (!value || typeof value !== 'string') {
      return value;
    }

    if (stack.includes(variableName)) {
      throw new StudioError({
        code: 'recursiveReference',
        message: `Recursive variable reference detected: ${[
          ...stack,
          variableName,
        ].join(' -> ')}`,
      });
    }

    const replaced = resolveStringSource({
      source: value,
      lookup: refName => {
        if (refName in localValuesMap) {
          return resolveVar(refName, [...stack, variableName]);
        }
        if (refName in externalValuesMap) {
          return externalValuesMap[refName];
        }
        return undefined;
      },
    });

    localValuesMap[variableName] = replaced;
    return replaced;
  };

  // resolve all
  for (const variableName of Object.keys(localValuesMap)) {
    resolveVar(variableName);
  }

  return localValuesMap;
};
