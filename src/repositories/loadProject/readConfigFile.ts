import { AppError, WORKSPACE_CONFIG_FILE, WORKSPACE_DIR } from '@/definitions';
import { readJsonRecord } from '@/helpers/fileIO';
import { joinPath, resolvePath } from '@/helpers/pathHelpers';

export async function readConfigFile(
  projectDir: string,
): Promise<{ openApiEntryPath: string; overlaysPaths: string[] }> {
  const apiStudioDir = joinPath(projectDir, WORKSPACE_DIR);
  const configPath = joinPath(apiStudioDir, WORKSPACE_CONFIG_FILE);
  const { json } = await readJsonRecord(configPath);

  const { openapi: openApiRelativePath, overlays: overlaysRelativePaths } =
    json;

  if (typeof openApiRelativePath !== 'string') {
    throw new AppError({
      code: 'invalidOpenapi',
      message: 'openapi path is invalid',
    });
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
