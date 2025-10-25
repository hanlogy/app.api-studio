import {useContext} from 'react';
import {RootContext, type RootState} from './RootContext';
import RNFS from 'react-native-fs';

export const useRootState = () => {
  return useContext(RootContext);
};

const cacheFolder = `${RNFS.LibraryDirectoryPath}/Application Support/ApiStudio`;
const cacheFile = `${cacheFolder}/state-cache.json`;

export const saveRootStateToCache = async (state: RootState) => {
  await RNFS.mkdir(cacheFolder);
  await RNFS.writeFile(cacheFile, JSON.stringify(state), 'utf8');
};

export const loadRootStateFromCache = async (): Promise<
  RootState | undefined
> => {
  const exists = await RNFS.exists(cacheFile);

  if (!exists) {
    return undefined;
  }

  const content = await RNFS.readFile(cacheFile, 'utf8');
  return JSON.parse(content);
};
