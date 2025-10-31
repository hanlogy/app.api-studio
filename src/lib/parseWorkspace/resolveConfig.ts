import {
  GLOBAL_ENV_NAME,
  JsonValue,
  Workspace,
  WorkspaceEnvironment,
} from '@/definitions';
import {isPlainObject} from '@/helpers/checkTypes';
import {pickDefinedString, removeUndefined} from '@/helpers/filterValues';
import {resolveValuesMap} from './resolveValuesMap';
import {resolveStringRecord} from './simpleResolvers';

export function resolveConfig({
  source,
}: {
  source: JsonValue;
}): Pick<Workspace, 'name' | 'description' | 'environments'> | undefined {
  if (!source || !isPlainObject(source)) {
    return undefined;
  }

  const {name, description, environments} = source;

  return removeUndefined({
    name: pickDefinedString(name),
    description: pickDefinedString(description),
    environments: resolveEnvironments({source: environments}) ?? [],
  });
}

function resolveEnvironments({
  source,
}: {
  source: JsonValue;
}): WorkspaceEnvironment[] | undefined {
  if (!source || !Array.isArray(source)) {
    return undefined;
  }

  return Object.entries(source)
    .map(([name, rawEnvironment]) => {
      if (!isPlainObject(rawEnvironment)) {
        return undefined;
      }

      const {headers, ...rest} = rawEnvironment;
      const valuesMap = resolveValuesMap({source: rest});

      return {
        name,
        isGlobal: name === GLOBAL_ENV_NAME,
        headers: resolveStringRecord({
          source: headers,
          valuesMap,
        }),
        valuesMap,
      };
    })
    .filter(e => e !== undefined);
}
