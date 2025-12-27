import { AppError, WORKSPACE_CONFIG_FILE, WORKSPACE_DIR } from '@/definitions';
import { getFileInfo, readJsonRecord } from '@/helpers/fileIO';
import { joinPath, resolvePath } from '@/helpers/pathHelpers';
import type { JsonRecordDocument } from './types';
import { fnv1a32Hex } from '@/helpers/fnv1a32Hex';

export async function readConfigFile(
  projectDir: string,
): Promise<JsonRecordDocument<{ openapi: string; overlays: string[] }>> {
  const apiStudioDir = joinPath(projectDir, WORKSPACE_DIR);
  const configPath = joinPath(apiStudioDir, WORKSPACE_CONFIG_FILE);
  const { json, type, text } = await readJsonRecord(configPath);

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
    path: configPath,
    type,
    text,
    mtime: (await getFileInfo(configPath)).mtime,
    hash: fnv1a32Hex(text),
    json: {
      openapi: openApiEntryPath,
      overlays: overlaysPaths,
    },
  };
}
