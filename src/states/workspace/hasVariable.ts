import type { RuntimeVariable, Workspace } from '@/definitions';

export function hasVariable(
  {
    environments,
    collections,
  }: Pick<Workspace, 'environments' | 'collections'>,
  {
    type,
    key: targetKey,
    name: variableName,
  }: Pick<RuntimeVariable, 'type' | 'key' | 'name'>,
) {
  switch (type) {
    case 'environment':
      return environments.some(({ name, valuesMap = {} }) => {
        return name === targetKey && variableName in valuesMap;
      });

    case 'collection':
      return collections.some(({ key, valuesMap = {} }) => {
        return key === targetKey && variableName in valuesMap;
      });

    case 'request':
      return collections.some(({ key: collectionKey, requests }) => {
        return (
          collectionKey === targetKey[1] &&
          requests.some(({ key: requestKey, valuesMap = {} }) => {
            return requestKey[0] === targetKey[0] && variableName in valuesMap;
          })
        );
      });
  }
}
