import { produce } from 'immer';

import {
  type PrimitiveValue,
  type RuntimeVariable,
  type RuntimeWorkspace,
  type ValuesMap,
} from '@/definitions';
import { isPrimitive } from '@/helpers/checkTypes';

export function upsertRuntimeVariable<
  T extends Pick<RuntimeWorkspace, 'collections' | 'environments'>,
>(workspace: T, { type, key, name, value }: RuntimeVariable): T {
  if (!name || !isPrimitive(value)) {
    return workspace;
  }

  switch (type) {
    case 'request': {
      if (!Array.isArray(key) || key.length !== 2) {
        return workspace;
      }

      return produce(workspace, draft => {
        draft.collections ??= [];

        // find or create collection
        let collection = draft.collections.find(e => e.key === key[1]);
        if (!collection) {
          collection = { key: key[1], requests: [] };
          draft.collections.push(collection);
        }

        // find or create request
        collection.requests ??= [];
        let request = collection.requests.find(e => e.key[0] === key[0]);
        if (!request) {
          request = { key, valuesMap: {} };
          collection.requests.push(request);
        }

        updateValueMap(request.valuesMap, name, value);
      });
    }

    case 'collection': {
      if (typeof key !== 'string') {
        return workspace;
      }

      return produce(workspace, draft => {
        draft.collections ??= [];

        let collection = draft.collections.find(e => e.key === key);
        if (!collection) {
          collection = { key, valuesMap: {} };
          draft.collections.push(collection);
        }

        updateValueMap(collection.valuesMap, name, value);
      });
    }

    case 'environment': {
      if (typeof key !== 'string') {
        return workspace;
      }

      return produce(workspace, draft => {
        draft.environments ??= [];

        let environment = draft.environments.find(e => e.name === key);
        if (!environment) {
          environment = { name: key, valuesMap: {} };
          draft.environments.push(environment);
        }

        updateValueMap(environment.valuesMap, name, value);
      });
    }
  }
}

function updateValueMap(
  valuesMap: ValuesMap | undefined = {},
  name: string,
  value: PrimitiveValue,
): void {
  valuesMap[name] = value;
}
