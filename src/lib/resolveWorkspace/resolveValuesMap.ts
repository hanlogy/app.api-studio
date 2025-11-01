/**
 * NOTE:
 * For resolving, the source is always a `JsonValue`. The user-provided config
 * is not guaranteed, so we should be as tolerant as possible.
 *
 * Also, we should always return `undefined` instead of assigning a default
 * value when the source is invalid, so the consumer can decide their own
 * defaults.
 */

import {isPlainObject, isPrimitive} from '@/helpers/checkTypes';
import type {JsonValue, PrimitiveRecord, ValuesMap} from '@/definitions';
import {resolveString} from './resolveString';
import {StudioError} from '@/definitions';

type ArgBase = {
  valuesMap?: ValuesMap;
};

export function resolveValuesMap(
  args: ArgBase & {source: PrimitiveRecord},
): ValuesMap;

export function resolveValuesMap(
  args: ArgBase & {source: JsonValue},
): ValuesMap | undefined;
export function resolveValuesMap({
  source,
  valuesMap: externalValuesMap = {},
}: ArgBase & {source: JsonValue}): ValuesMap | undefined {
  if (!source || !isPlainObject(source)) {
    return undefined;
  }

  const definitionItems = Object.entries(source)
    .filter(([name, value]) => name.startsWith(':') && isPrimitive(value))
    .map(([name, value]) => [name.slice(1), value]);

  // return `undefined` if empty, to facilitate test cases.
  if (!definitionItems.length) {
    return undefined;
  }

  const localValuesMap: ValuesMap = Object.fromEntries(definitionItems);

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
}
