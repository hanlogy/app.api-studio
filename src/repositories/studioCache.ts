import {type JsonRecord, STUDIO_CACHE} from '@/definitions';
import {readJsonRecord, writeJsonRecord} from '@/helpers/fileIO';
import {isPlainObject} from '@/helpers/checkTypes';
import {StudioStateCache} from '@/states/studio/types';
import {pickWhenString} from '@/helpers/filterValues';

export async function saveStudioCache(state: StudioStateCache) {
  await writeJsonRecord({
    fileName: STUDIO_CACHE,
    data: state,
  });
}

export async function readStudioCache(): Promise<StudioStateCache | null> {
  const cache = await readJsonRecord({
    fileName: STUDIO_CACHE,
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

  if (!Array.isArray(workspaces)) {
    return null;
  }

  const workspacesResolved = workspaces
    .map(item => {
      if (!isPlainObject(item)) {
        return undefined;
      }

      const name = pickWhenString(item.name);
      const path = pickWhenString(item.path);
      if (!name || !path) {
        return undefined;
      }

      return {name, path};
    })
    .filter(e => e !== undefined);

  return {workspaces: workspacesResolved};
}
