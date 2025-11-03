import { type JsonRecord, STUDIO_CACHE_FILE } from '@/definitions';
import { readJsonRecord, writeJsonRecord } from '@/helpers/fileIO';
import { isPlainObject } from '@/helpers/checkTypes';
import { StudioStateCache } from '@/states/studio/types';
import { pickWhenString, removeUndefined } from '@/helpers/filterValues';

var data: StudioStateCache = {};

export async function updateStudioCache<K extends keyof StudioStateCache>(
  name: K,
  value: StudioStateCache[K],
) {
  data[name] = value;

  await writeJsonRecord({
    file: STUDIO_CACHE_FILE,
    data: data,
  });
}

export async function readStudioCache(): Promise<StudioStateCache> {
  const cache = await readJsonRecord({
    file: STUDIO_CACHE_FILE,
  });

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
          const environmentName = pickWhenString(item.environmentName);
          if (!name || !dir) {
            return undefined;
          }

          return removeUndefined({ name, dir, environmentName });
        })
        .filter(e => e !== undefined)
    : undefined;

  return removeUndefined({ workspaces: parsedWorkspaces });
}
