import {isPlainObject} from '@/helpers/isPlainObject';
import {isPrimitive} from '@/helpers/isPrimitive';
import type {Variables} from '@/definitions/types';
import {resolveVariablePlaceholders} from './resolveVariablePlaceholders';
import {StudioError} from '@/definitions';

export const buildVariables = (
  data?: unknown,
  externalVariables: Variables = {},
): Variables => {
  if (!data || !isPlainObject(data)) {
    return {};
  }

  const localVariables: Variables = {};

  for (const [name, value] of Object.entries(data)) {
    if (name.startsWith(':') && isPrimitive(value)) {
      localVariables[name.slice(1)] = value;
    }
  }

  const resolveVar = (
    variableName: string,
    stack: string[] = [],
  ): string | number | boolean | null => {
    const value = localVariables[variableName];
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

    const replaced = resolveVariablePlaceholders(value, refName => {
      if (refName in localVariables) {
        return resolveVar(refName, [...stack, variableName]);
      }
      if (refName in externalVariables) {
        return externalVariables[refName];
      }
      return undefined;
    });

    localVariables[variableName] = replaced;
    return replaced;
  };

  // resolve all
  for (const variableName of Object.keys(localVariables)) {
    resolveVar(variableName);
  }

  return localVariables;
};
