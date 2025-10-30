/*
import {WorkspaceFiles} from '@/states/studio/watchWorkspace';
import {parseConfigFile} from './parseConfigFile';
import {resolveEnvironmentSettings} from './resolveEnvironmentSettings';

interface Props {
  environmentName?: string;
  workspacePath: string;
  files: WorkspaceFiles;
}

export class WorkspaceParser {
  private constructor({environmentName, workspacePath, files}: Props) {
    if (!files.config) {
      throw new Error('configMissing');
    }

    this.path = workspacePath;
    this.apiFiles = files.apis ?? [];
    this.configFile = files.config;
    this.environmentName = environmentName;
  }

  private readonly path: string;
  private readonly environmentName?: string;
  private readonly configFile: string;
  private readonly apiFiles: string[];

  private async parseWorkspace() {
    const {
      environments,
      name: workspaceName,
      description: workspaceDescription,
    } = await parseConfigFile(this.path, this.configFile);

    const environment = resolveEnvironmentSettings(
      environments,
      this.environmentName,
    );
  }

  // private async parseConfigFile() {
  //   const {environments, name, description} = await parseConfigFile(
  //     this.path,
  //     this.configFile,
  //   );
  // }

  static async parse(props: Props) {
    return await new WorkspaceParser(props).parseWorkspace();
  }
}
  */
