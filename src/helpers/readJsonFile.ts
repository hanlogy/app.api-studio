import RNFS from 'react-native-fs';

export const readJsonFile = async <T = Record<string, unknown>>(
  filePath: string,
): Promise<T> => {
  return JSON.parse(await RNFS.readFile(filePath, 'utf8'));
};
