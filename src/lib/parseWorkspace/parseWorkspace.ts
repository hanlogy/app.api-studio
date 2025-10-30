import {resolveEnvironmentSettings} from './resolveEnvironmentSettings';
import {parseConfigFile} from './parseConfigFile';
import {parseApiFile} from './parseApiFile';
import {
  type WorkspaceResource,
  type Workspace,
  type WorkspaceFiles,
} from '@/definitions';

// NOTE:
// DO NOT create the config file if it does not exist. Show an error instead,
// because the user might accidentally open the wrong folder.
export const parseWorkspace = async ({
  environmentName,
  workspacePath,
  files: {config: configFile, apis: apiFiles = []},
}: {
  environmentName?: string;
  workspacePath: string;
  files: WorkspaceFiles;
}): Promise<Workspace> => {
  if (!configFile) {
    throw new Error('configMissing');
  }

  const {environments, name, description} = await parseConfigFile(
    workspacePath,
    configFile,
  );

  const environment = resolveEnvironmentSettings(environments, environmentName);

  const resources: WorkspaceResource[] = [];

  if (apiFiles.length) {
    // resources.push(await parseApiFile());
  }
  return {
    name,
    path: workspacePath,
    description,
    environments,
    resources,
  };
};
