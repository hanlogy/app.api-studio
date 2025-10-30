import {readJsonFile} from '@/helpers/readJsonFile';
import type {Workspace} from '@/definitions/types';
import {buildHeaders} from './buildHeaders';
import {buildVariables} from './buildVariables';

const GLOBAL = '@global';

interface RawConfig {
  readonly name: string;
  readonly description: string;
  readonly environments: Record<string, Record<string, unknown>>;
}

export const parseConfigFile = async (
  dir: string,
  file: string,
): Promise<Pick<Workspace, 'name' | 'environments' | 'description'>> => {
  const {
    name: workspaceName,
    description,
    environments: rawEnvironments,
  } = await readJsonFile<RawConfig>(`${dir}/${file}`);

  const environments = Object.entries(rawEnvironments).map(
    ([environmentName, {headers, ...others}]) => {
      return {
        name: environmentName,
        isGlobal: environmentName === GLOBAL,
        headers: buildHeaders(headers),
        variables: buildVariables(others),
      };
    },
  );

  return {
    name: workspaceName,
    description,
    environments,
  };
};
