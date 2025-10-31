import {readJsonFile} from '@/helpers/readJsonFile';
import {GLOBAL_ENV_NAME, type Workspace} from '@/definitions';
import {resolveValuesMap} from './resolveValuesMap';
import type {RawWorkspaceConfig} from './types';
import {resolvePrimitiveRecordSource} from './resolvePrimitiveRecordSource';

export const parseConfigFile = async (
  filePath: string,
): Promise<Pick<Workspace, 'name' | 'environments' | 'description'>> => {
  const {
    name: workspaceName,
    description,
    environments: rawEnvironments,
  } = await readJsonFile<RawWorkspaceConfig>(`${filePath}`);

  const environments = Object.entries(rawEnvironments).map(
    ([environmentName, {headers = {}, ...rest}]) => {
      const valuesMap = resolveValuesMap({source: rest});

      return {
        name: environmentName,
        isGlobal: environmentName === GLOBAL_ENV_NAME,
        headers: resolvePrimitiveRecordSource({
          source: headers,
          valuesMap,
          transform: String,
        }),
        valuesMap,
      };
    },
  );

  return {
    name: workspaceName,
    description,
    environments,
  };
};
