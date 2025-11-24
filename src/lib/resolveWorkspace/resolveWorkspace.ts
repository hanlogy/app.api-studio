import {
  GLOBAL_ENV_NAME,
  type JsonValue,
  type RuntimeWorkspace,
  type RuntimeWorkspaceEnvironment,
  type ValuesMap,
  type Workspace,
  type WorkspaceEnvironment,
} from '@/definitions';
import { resolveConfig } from './resolveConfig';
import { removeUndefined } from '@/helpers/filterValues';
import { resolveCollectionResource } from './resolveCollectionResource';
import { isPlainObject } from '@/helpers/checkTypes';
import { sortByOrder } from '@/helpers/sortByOrder';

export function resolveWorkspace({
  sources: { config: configSource, collections: collectionsSources },
  environmentName,
  runtimeWorkspace = {},
}: {
  readonly sources: {
    readonly config: JsonValue;
    readonly collections: readonly JsonValue[];
  };
  readonly environmentName?: string;
  readonly runtimeWorkspace?: RuntimeWorkspace;
}): Omit<Workspace, 'dir' | 'environmentName'> | undefined {
  const resolvedConfig = resolveConfig({ source: configSource });

  if (!resolvedConfig) {
    return undefined;
  }

  const { environments, name, description } = resolvedConfig;
  const environmentValuesMap = resolveValuesMap({
    environments,
    environmentName,
    runtimeEnvironments: runtimeWorkspace.environments,
  });

  const accumulateCollectionIds: string[] = [];

  return removeUndefined({
    name,
    description,
    environments,
    collections: sortByOrder(
      collectionsSources
        .map(rawEndpontResource => {
          if (!isPlainObject(rawEndpontResource)) {
            return undefined;
          }
          return resolveCollectionResource({
            source: rawEndpontResource,
            valuesMap: environmentValuesMap,
            accumulateIds: accumulateCollectionIds,
          });
        })
        .filter(e => e !== undefined),
    ),
  });
}

export const resolveValuesMap = ({
  environments = [],
  runtimeEnvironments = [],
  environmentName,
}: {
  readonly runtimeEnvironments?: readonly RuntimeWorkspaceEnvironment[];
  readonly environments: readonly WorkspaceEnvironment[];
  environmentName?: string;
}): ValuesMap => {
  const global = environments.find(e => e.isGlobal);
  const globalRuntime = runtimeEnvironments.find(
    e => e.name === GLOBAL_ENV_NAME,
  );
  const local = environments.find(e => e.name === environmentName);
  const localRuntime = runtimeEnvironments.find(
    e => e.name === environmentName,
  );

  return {
    ...(global?.valuesMap ?? {}),
    ...(globalRuntime?.valuesMap ?? {}),
    ...(local?.valuesMap ?? {}),
    ...(localRuntime?.valuesMap ?? {}),
  };
};
