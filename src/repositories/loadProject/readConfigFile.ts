import { AppError, WORKSPACE_CONFIG_FILE } from '@/definitions';
import { joinPath, resolvePath } from '@/helpers/pathHelpers';
import type { ConfigDocument } from './types';
import { readJsonRecordWithStat } from './readJsonRecordWithStat';

export async function readConfigFile(
  apiStudioDir: string,
): Promise<ConfigDocument> {
  const configPath = joinPath(apiStudioDir, WORKSPACE_CONFIG_FILE);
  const configDoc = await readJsonRecordWithStat<ConfigDocument['json']>(
    configPath,
  );

  const { openapi: openApiRelativePath, overlays: overlaysRelativePaths } =
    configDoc.json;

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

  const overlayPaths = Array.isArray(overlaysRelativePaths)
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
    ...configDoc,
    json: {
      openapi: openApiEntryPath,
      overlays: overlayPaths,
    },
  };
}
