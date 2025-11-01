import {
  GLOBAL_ENV_NAME,
  type JsonValue,
  type Workspace,
  type WorkspaceEnvironment,
} from '@/definitions';
import {isPlainObject} from '@/helpers/checkTypes';
import {pickWhenString, removeUndefined} from '@/helpers/filterValues';
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
    name: pickWhenString(name),
    description: pickWhenString(description),
    environments: resolveEnvironments({source: environments}) ?? [],
  });
}

function resolveEnvironments({
  source,
}: {
  source: JsonValue;
}): WorkspaceEnvironment[] | undefined {
  if (!source || !isPlainObject(source)) {
    return undefined;
  }

  return Object.entries(source)
    .map(([name, rawEnvironment]) => {
      if (!isPlainObject(rawEnvironment)) {
        return undefined;
      }

      const {headers, ...rest} = rawEnvironment;
      const valuesMap = resolveValuesMap({source: rest});

      return removeUndefined({
        name,
        isGlobal: name === GLOBAL_ENV_NAME,
        headers: resolveStringRecord({
          source: headers,
          valuesMap,
        }),
        valuesMap,
      });
    })
    .filter(e => e !== undefined);
}
