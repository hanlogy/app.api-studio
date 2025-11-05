import {
  type JsonValue,
  type ValuesMap,
  type Workspace,
  type WorkspaceEnvironment,
} from '@/definitions';
import { resolveConfig } from './resolveConfig';
import { removeUndefined } from '@/helpers/filterValues';
import { resolveCollectionResource } from './resolveCollectionResource';
import { isPlainObject } from '@/helpers/checkTypes';

export function resolveWorkspace({
  sources: { config: configSource, collections: collectionsSources },
  environmentName,
}: {
  sources: {
    readonly config: JsonValue;
    readonly collections: readonly JsonValue[];
  };
  environmentName?: string;
}): Omit<Workspace, 'dir' | 'environmentName'> | undefined {
  const resolvedConfig = resolveConfig({ source: configSource });

  if (!resolvedConfig) {
    return undefined;
  }

  const { environments, name, description } = resolvedConfig;
  const environmentValuesMap = resolveValuesMap({
    environments,
    environmentName,
  });

  return removeUndefined({
    name,
    description,
    environments,
    collections: collectionsSources
      .map(rawEndpontResource => {
        if (!isPlainObject(rawEndpontResource)) {
          return undefined;
        }
        return resolveCollectionResource({
          source: rawEndpontResource,
          valuesMap: environmentValuesMap,
        });
      })
      .filter(e => e !== undefined),
  });
}

export const resolveValuesMap = ({
  environments = [],
  environmentName,
}: {
  environments: readonly WorkspaceEnvironment[];
  environmentName?: string;
}): ValuesMap => {
  const global = environments.find(e => e.isGlobal);
  const local = environments.find(e => e.name === environmentName);

  return { ...(global?.valuesMap ?? {}), ...(local?.valuesMap ?? {}) };
};
