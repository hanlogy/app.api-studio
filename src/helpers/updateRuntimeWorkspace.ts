import { produce } from 'immer';

import type {
  PrimitiveValue,
  RequestResourceKey,
  RuntimeWorkspace,
  ValuesMap,
} from '@/definitions';
import { isPlainObject, isPrimitive } from '@/helpers/checkTypes';

type UpdateTarget =
  | 'requestVariable'
  | 'collectionVariable'
  | 'environmentVariable';

type PartialWorkspace = Pick<RuntimeWorkspace, 'collections' | 'environments'>;
interface UpdateWorkspaceOptions {
  key: string | RequestResourceKey;
  name: string;
  value: PrimitiveValue;
}

export function updateRuntimeWorkspace(
  workspace: PartialWorkspace,
  target: 'requestVariable',
  options: {
    key: RequestResourceKey;
    name: string;
    value: PrimitiveValue;
  },
): RuntimeWorkspace;

export function updateRuntimeWorkspace(
  workspace: PartialWorkspace,
  target: 'collectionVariable',
  options: {
    key: string;
    name: string;
    value: PrimitiveValue;
  },
): RuntimeWorkspace;

export function updateRuntimeWorkspace(
  workspace: PartialWorkspace,
  target: 'environmentVariable',
  options: {
    key: string;
    name: string;
    value: PrimitiveValue;
  },
): RuntimeWorkspace;

export function updateRuntimeWorkspace(
  workspace: Pick<RuntimeWorkspace, 'collections' | 'environments'>,
  target: UpdateTarget,
  { key, name, value }: UpdateWorkspaceOptions,
) {
  switch (target) {
    case 'requestVariable': {
      if (!Array.isArray(key) || key.length !== 2) {
        return workspace;
      }

      return produce(workspace, ({ collections }) => {
        for (const collection of collections) {
          if (collection.key === key[1]) {
            for (const request of collection.requests) {
              if (request.key[0] === key[0]) {
                request.valuesMap = updateValueMap(
                  request.valuesMap,
                  name,
                  value,
                );
                break;
              }
            }
          }
        }
      });
    }
    case 'collectionVariable': {
      if (typeof key !== 'string') {
        return workspace;
      }

      return produce(workspace, ({ collections }) => {
        for (const collection of collections) {
          if (collection.key === key) {
            collection.valuesMap = updateValueMap(
              collection.valuesMap,
              name,
              value,
            );
            break;
          }
        }
      });
    }
    case 'environmentVariable': {
      if (typeof key !== 'string') {
        return workspace;
      }

      return produce(workspace, ({ environments }) => {
        for (const environment of environments) {
          if (environment.name === key) {
            environment.valuesMap = updateValueMap(
              environment.valuesMap,
              name,
              value,
            );
            break;
          }
        }
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
