import {type JsonRecord, STUDIO_CACHE_FILE} from '@/definitions';
import {readJsonRecord, writeJsonRecord} from '@/helpers/fileIO';
import {isPlainObject} from '@/helpers/checkTypes';
import {StudioStateCache} from '@/states/studio/types';
import {pickWhenString, removeUndefined} from '@/helpers/filterValues';

export async function saveStudioCache(state: StudioStateCache) {
  await writeJsonRecord({
    file: STUDIO_CACHE_FILE,
    data: state,
  });
}

export async function readStudioCache(): Promise<StudioStateCache | null> {
  const cache = await readJsonRecord({
    file: STUDIO_CACHE_FILE,
  });

  if (!cache) {
    return null;
  }

  return parseStudioCache(cache);
}

function parseStudioCache(cache: JsonRecord): StudioStateCache | null {
  if (!cache || !isPlainObject(cache)) {
    return null;
  }

  const {workspaces} = cache;

  const parsedWorkspaces = Array.isArray(workspaces)
    ? workspaces
        .map(item => {
          if (!isPlainObject(item)) {
            return undefined;
          }

          const name = pickWhenString(item.name);
          const dir = pickWhenString(item.dir);
          const environmentName = pickWhenString(item.environmentName);
          if (!name || !dir) {
            return undefined;
          }

          return removeUndefined({name, dir, environmentName});
        })
        .filter(e => e !== undefined)
    : [];

  return {workspaces: parsedWorkspaces};
}
