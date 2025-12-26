import { WORKSPACE_CONFIG_FILE, WORKSPACE_DIR } from '@/definitions';
import { readJsonRecord } from '@/helpers/fileIO';
import { joinPath, resolvePath } from '@/helpers/pathHelpers';

export async function readConfigFile(
  projectDir: string,
): Promise<{ openApiEntryPath: string; overlaysPaths: string[] } | null> {
  const apiStudioDir = joinPath(projectDir, WORKSPACE_DIR);
  const configPath = joinPath(apiStudioDir, WORKSPACE_CONFIG_FILE);
  const configData = await readJsonRecord(configPath);

  if (!configData) {
    return null;
  }

  const { openapi: openApiRelativePath, overlays: overlaysRelativePaths } =
    configData;

  if (typeof openApiRelativePath !== 'string') {
    return null;
  }

  const openApiEntryPath = resolvePath({
    absoluteDir: apiStudioDir,
    relativePath: openApiRelativePath,
  });

  const overlaysPaths = Array.isArray(overlaysRelativePaths)
    ? overlaysRelativePaths
        .map((e: unknown) => {
          if (typeof e === 'string') {
            return resolvePath({
              absoluteDir: apiStudioDir,
              relativePath: e,
            });
          }
          return undefined;
        })
        .filter(e => e !== undefined)
    : [];

  return {
    openApiEntryPath,
    overlaysPaths,
  };
}
