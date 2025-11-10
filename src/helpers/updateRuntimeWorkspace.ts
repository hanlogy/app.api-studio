import { produce } from 'immer';

import {
  AppError,
  type PrimitiveValue,
  type RequestResourceKey,
  type RuntimeWorkspace,
  type ValuesMap,
} from '@/definitions';
import { isPlainObject, isPrimitive } from '@/helpers/checkTypes';

export type UpdateRuntimeWorkspaceTarget =
  | 'requestVariable'
  | 'collectionVariable'
  | 'environmentVariable';

type PartialWorkspace = Pick<RuntimeWorkspace, 'collections' | 'environments'>;
interface UpdateWorkspaceOptions {
  readonly key: string | RequestResourceKey;
  readonly name: string;
  readonly value: PrimitiveValue;
}

export function updateRuntimeWorkspace(
  workspace: PartialWorkspace,
  target: 'requestVariable',
  options: {
    readonly key: RequestResourceKey;
    readonly name: string;
    readonly value: PrimitiveValue;
  },
): RuntimeWorkspace;

export function updateRuntimeWorkspace(
  workspace: PartialWorkspace,
  target: 'collectionVariable' | 'environmentVariable',
  options: {
    readonly key: string;
    readonly name: string;
    readonly value: PrimitiveValue;
  },
): RuntimeWorkspace;

export function updateRuntimeWorkspace(
  workspace: Pick<RuntimeWorkspace, 'collections' | 'environments'>,
  target: UpdateRuntimeWorkspaceTarget,
  { key, name, value }: UpdateWorkspaceOptions,
) {
  switch (target) {
    case 'requestVariable': {
      if (!Array.isArray(key) || key.length !== 2) {
        return workspace;
      }

      return produce(workspace, ({ collections = [] }) => {
        for (const collection of collections) {
          if (collection.key === key[1]) {
            for (const request of collection.requests ?? []) {
              if (request.key[0] === key[0]) {
                request.valuesMap = updateValueMap(
                  request.valuesMap,
                  name,
                  value,
                );
                return;
              }
            }
          }
        }
        throw new AppError({
          code: 'requestVariableNotExist',
          message: `The request variable "${name}" does not exist`,
        });
      });
    }

    case 'collectionVariable': {
      if (typeof key !== 'string') {
        return workspace;
      }

      return produce(workspace, ({ collections = [] }) => {
        for (const collection of collections) {
          if (collection.key === key) {
            collection.valuesMap = updateValueMap(
              collection.valuesMap,
              name,
              value,
            );
            return;
          }
        }

        throw new AppError({
          code: 'collectionVariableNotExist',
          message: `The collection variable "${name}" does not exist`,
        });
      });
    }

    case 'environmentVariable': {
      if (typeof key !== 'string') {
        return workspace;
      }

      return produce(workspace, ({ environments = [] }) => {
        for (const environment of environments) {
          if (environment.name === key) {
            environment.valuesMap = updateValueMap(
              environment.valuesMap,
              name,
              value,
            );
            return;
          }
        }

        throw new AppError({
          code: 'environmentVariableNotExist',
          message: `The environment variable "${name}" does not exist`,
        });
      });
    }
  }
}

function updateValueMap(
  valuesMap: ValuesMap | undefined,
  name: string,
  value: PrimitiveValue,
) {
  if (
    !valuesMap ||
    !name ||
    !isPlainObject(valuesMap) ||
    !isPrimitive(value) ||
    name in valuesMap === false
  ) {
    return valuesMap;
  }

  return produce(valuesMap, draft => {
    draft[name] = value;
  });
}
