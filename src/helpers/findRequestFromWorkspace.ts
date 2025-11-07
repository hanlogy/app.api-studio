import type { RequestResourceKey, Workspace } from '@/definitions';
import { removeUndefined } from '@/helpers/filterValues';

export function findRequestFromWorkspace(
  workspace: Workspace,
  {
    key,
    environmentName,
  }: { key?: RequestResourceKey; environmentName?: string } = {},
) {
  if (!key) {
    return undefined;
  }

  const collection = workspace.collections.find(e => e.key === key[1]);
  if (!collection) {
    return undefined;
  }

  const request = collection.requests.find(e => e.key[0] === key[0]);
  if (!request) {
    return undefined;
  }

  const globalEnvironment = workspace.environments.find(e => e.isGlobal);
  const environment = workspace.environments.find(
    e => e.name === environmentName,
  );

  return {
    ...request,
    collection: removeUndefined({
      name: collection.name,
      headers: collection.headers,
      baseUrl: collection.baseUrl,
      valuesMap: collection.valuesMap,
    }),
    environments: [
      globalEnvironment
        ? {
            isGlobal: true,
            name: globalEnvironment.name,
            valuesMap: globalEnvironment.valuesMap,
            headers: globalEnvironment.headers,
          }
        : undefined,
      environment
        ? removeUndefined({
            isGlobal: false,
            name: environment.name,
            valuesMap: environment.valuesMap,
            headers: environment.headers,
          })
        : undefined,
    ].filter(e => e !== undefined),
  };
}
