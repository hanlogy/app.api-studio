import {
  JsonRecord,
  ValuesMap,
  Workspace,
  WorkspaceEnvironment,
} from '@/definitions';
import {resolveConfig} from './resolveConfig';
import {pickDefinedString} from '@/helpers/filterValues';
import {resolveCollectionResource} from './resolveCollectionResource';
import {resolveApiResource} from './resolveApiResource';

export function resolveWorkspace({
  source: {config: configSource, apis: apisSources},
  environmentName,
}: {
  source: {
    config: JsonRecord;
    apis: JsonRecord[];
  };
  environmentName?: string;
}): Omit<Workspace, 'path'> | undefined {
  const resolvedConfig = resolveConfig({source: configSource});

  if (!resolvedConfig) {
    return undefined;
  }

  const {environments, name, description} = resolvedConfig;
  const environmentValuesMap = resolveValuesMap({
    environments,
    environmentName,
  });

  return {
    name: pickDefinedString(name),
    description: pickDefinedString(description),
    environments,
    apis: apisSources
      .map(rawApiResource => {
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
  };
}

export const resolveValuesMap = ({
  environments = [],
  environmentName,
}: {
  environments: readonly WorkspaceEnvironment[];
  environmentName?: string;
}): ValuesMap => {
  const global = environments.find(e => 'isGlobal' in e && e.isGlobal === true);
  const local = environments.find(
    e => 'name' in e && e.name === environmentName,
  );

  return {...(global?.valuesMap ?? {}), ...(local?.valuesMap ?? {})};
};
