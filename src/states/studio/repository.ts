import {readFromCache, saveToCache} from '../../repositories/cache';
import {StudioState} from './types';

const cacheFileName = 'studio-cache';

export const saveStudioState = async (state: StudioState) => {
  await saveToCache(cacheFileName, state);
};

export const fetchStudioState = async () => {
  return readFromCache<StudioState>(cacheFileName);
};
