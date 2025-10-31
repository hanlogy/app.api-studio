import {isPlainObject} from '@/helpers/isPlainObject';
import {isPrimitive} from '@/helpers/isPrimitive';
import type {ValuesMap, VariableDefinitions} from '@/definitions';
import {resolveString} from './resolveString';
import {StudioError} from '@/definitions';

export const resolveValuesMap = ({
  source,
  valuesMap: externalValuesMap = {},
}: {
  source?: VariableDefinitions;
  valuesMap?: ValuesMap;
} = {}): ValuesMap => {
  if (!source || !isPlainObject(source)) {
    return {};
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

    const replaced = resolveString({
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
