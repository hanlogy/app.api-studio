import {readFromCache, saveToCache} from '@/repositories/cache';
import {StudioStateCache} from './types';

const cacheFileName = 'studio-cache';

export const saveStudioState = async (state: StudioStateCache) => {
  await saveToCache(cacheFileName, state);
};

export const fetchStudioState = async () => {
  return readFromCache<StudioStateCache>(cacheFileName);
};
