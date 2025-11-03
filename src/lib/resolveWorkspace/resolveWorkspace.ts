import {
  type JsonValue,
  type ValuesMap,
  type Workspace,
  type WorkspaceEnvironment,
} from '@/definitions';
import {resolveConfig} from './resolveConfig';
import {removeUndefined} from '@/helpers/filterValues';
import {resolveCollectionResource} from './resolveCollectionResource';
import {resolveApiResource} from './resolveApiResource';
import {isPlainObject} from '@/helpers/checkTypes';

export function resolveWorkspace({
  sources: {config: configSource, apis: apisSources},
  environmentName,
}: {
  sources: {
    config: JsonValue;
    apis: JsonValue[];
  };
  environmentName?: string;
}): Omit<Workspace, 'dir'> | undefined {
  const resolvedConfig = resolveConfig({source: configSource});

  if (!resolvedConfig) {
    return undefined;
  }

  const {environments, name, description} = resolvedConfig;
  const environmentValuesMap = resolveValuesMap({
    environments,
    environmentName,
  });

  return removeUndefined({
    name,
    description,
    environments,
    apis: apisSources
      .map(rawApiResource => {
        if (!isPlainObject(rawApiResource)) {
          return undefined;
        }
        if ('apis' in rawApiResource) {
          return resolveCollectionResource({
            source: rawApiResource,
            valuesMap: environmentValuesMap,
          });
        } else {
          return resolveApiResource({
            source: rawApiResource,
            valuesMap: environmentValuesMap,
          });
        }
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

  return {...(global?.valuesMap ?? {}), ...(local?.valuesMap ?? {})};
};
