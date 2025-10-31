import {WorkspaceEnvironment} from '@/definitions';

export const resolveEnvironmentSettings = (
  environments: readonly Partial<WorkspaceEnvironment>[] = [],
  name?: string,
): Pick<WorkspaceEnvironment, 'headers' | 'variables'> => {
  const global = environments.find(e => e.isGlobal);
  const local = environments.find(e => e.name === name);

  return {
    headers: {...global?.headers, ...local?.headers},
    variables: {...global?.variables, ...local?.variables},
  };
};
