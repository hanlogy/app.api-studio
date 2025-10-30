import {readJsonFile} from '@/helpers/readJsonFile';
import type {Workspace} from '@/definitions';
import {buildHeaders} from './buildHeaders';
import {buildVariables} from './buildVariables';

const GLOBAL = '@global';

interface RawConfig {
  readonly name: string;
  readonly description: string;
  readonly environments: Record<string, Record<string, unknown>>;
}

export const parseConfigFile = async (
  filePath: string,
): Promise<Pick<Workspace, 'name' | 'environments' | 'description'>> => {
  const {
    name: workspaceName,
    description,
    environments: rawEnvironments,
  } = await readJsonFile<RawConfig>(`${filePath}`);

  const environments = Object.entries(rawEnvironments).map(
    ([environmentName, {headers, ...rest}]) => {
      const variables = buildVariables(rest);

      return {
        name: environmentName,
        isGlobal: environmentName === GLOBAL,
        headers: buildHeaders(headers, variables),
        variables,
      };
    },
  );

  return {
    name: workspaceName,
    description,
    environments,
  };
};
