import { type JsonRecord, STUDIO_CACHE_FILE } from '@/definitions';
import {
  CACHE_FOLDER,
  readJsonRecord,
  writeJsonRecord,
} from '@/helpers/fileIO';
import { isPlainObject } from '@/helpers/checkTypes';
import { type StudioStateCache } from '@/states/studio/types';
import { pickWhenString, removeUndefined } from '@/helpers/filterValues';
import { joinPath } from '@/helpers/pathHelpers';

var data: StudioStateCache = {};

export async function updateStudioCache<K extends keyof StudioStateCache>(
  name: K,
  value: StudioStateCache[K],
) {
  data[name] = value;

  await writeJsonRecord({
    path: joinPath(CACHE_FOLDER, STUDIO_CACHE_FILE),
    data: data,
  });
}

export async function readStudioCache(): Promise<StudioStateCache> {
  const cache = await readJsonRecord(joinPath(CACHE_FOLDER, STUDIO_CACHE_FILE));

  data = parseStudioCache(cache) ?? {};
  return data;
}

function parseStudioCache(cache: JsonRecord | null): StudioStateCache | null {
  if (!cache || !isPlainObject(cache)) {
    return null;
  }

  const { workspaces } = cache;

  const parsedWorkspaces = Array.isArray(workspaces)
    ? workspaces
        .map(item => {
          if (!isPlainObject(item)) {
            return undefined;
          }

          const name = pickWhenString(item.name);
          const dir = pickWhenString(item.dir);
          const selectedEnvironment = pickWhenString(item.selectedEnvironment);
          if (!name || !dir) {
            return undefined;
          }

          return removeUndefined({ name, dir, selectedEnvironment });
        })
        .filter(e => e !== undefined)
    : undefined;

  return removeUndefined({ workspaces: parsedWorkspaces });
}
