import { API_STUDIO_DIR } from '@/definitions';
import { readConfigFile } from './readConfigFile';
import { joinPath } from '@/helpers/pathHelpers';
import type { ProjectSource } from './types';
import { loadOpenApiClosure } from './loadOpenApiClosure';
import { buildReverseDeps } from './buildReverseDeps';

export async function buildProjectData({
  projectDir,
  previous,
}: {
  projectDir: string;
  previous: ProjectSource | null;
}): Promise<ProjectSource> {
  const apiStudioDir = joinPath(projectDir, API_STUDIO_DIR);

  const configDoc = await readConfigFile(apiStudioDir, previous?.configDoc);
  const { openApiDocs, forwardDeps } = await loadOpenApiClosure(
    configDoc.json.openapi,
    previous?.openApiDocs,
  );

  return {
    projectDir,
    configDoc,
    openApiDocs,
    forwardDeps,
    reverseDeps: buildReverseDeps(forwardDeps, {
      previousForwardDeps: previous?.forwardDeps,
      previousReverseDeps: previous?.reverseDeps,
    }),
  };
}
