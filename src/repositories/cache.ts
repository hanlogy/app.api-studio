import RNFS from 'react-native-fs';

const cacheFolder = `${RNFS.LibraryDirectoryPath}/Application Support/ApiStudio`;

const buildFilePath = (fileName: string) => `${cacheFolder}/${fileName}.json`;

export const saveToCache = async <T>(fileName: string, data: T) => {
  const cacheFile = buildFilePath(fileName);
  await RNFS.mkdir(cacheFolder);
  await RNFS.writeFile(cacheFile, JSON.stringify(data), 'utf8');
};

export const readFromCache = async <T>(fileName: string): Promise<T | null> => {
  const cacheFile = buildFilePath(fileName);
  const exists = await RNFS.exists(cacheFile);

  if (!exists) {
    return null;
  }

  const content = await RNFS.readFile(cacheFile, 'utf8');
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
};
