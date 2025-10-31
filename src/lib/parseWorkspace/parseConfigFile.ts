import {readJsonRecordFile} from '@/helpers/readJsonRecordFile';
import {
  GLOBAL_ENV_NAME,
  WorkspaceEnvironment,
  type Workspace,
} from '@/definitions';
import {resolveValuesMap} from './resolveValuesMap';
import {resolvePrimitiveRecord} from './resolvePrimitiveRecord';
import {isPlainObject} from '@/helpers/isPlainObject';

export const parseConfigFile = async (
  filePath: string,
): Promise<Pick<Workspace, 'name' | 'environments' | 'description'>> => {
  const {
    name: workspaceName,
    description,
    environments: rawEnvironments,
  } = await readJsonRecordFile(`${filePath}`);

  let environments: WorkspaceEnvironment[] = [];
  if (isPlainObject(rawEnvironments)) {
    environments = Object.entries(rawEnvironments)
      .map(([environmentName, rawEnvironment]) => {
        if (!isPlainObject(rawEnvironment)) {
          return undefined;
        }

        const {headers, ...rest} = rawEnvironment;
        const valuesMap = resolveValuesMap({source: rest});
        const resolvedHeaders = resolvePrimitiveRecord({
          source: headers,
          valuesMap,
          transform: String,
        });

        return {
          name: environmentName,
          isGlobal: environmentName === GLOBAL_ENV_NAME,
          headers: resolvedHeaders ?? {},
          valuesMap: valuesMap ?? {},
        };
      })
      .filter(e => e !== undefined);
  }

  return {
    name: typeof workspaceName === 'string' ? workspaceName : '',
    ...(typeof description === 'string' ? {description} : {}),
    environments,
  };
};
