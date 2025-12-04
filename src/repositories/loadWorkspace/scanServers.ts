import RNFS from 'react-native-fs';
import { findTopLevelEntrances, getModifiedTime, isJsonFile } from './helpers';

export async function scanServers(serversDir: string) {
  const serversMap: Record<string, number> = {};
  const serverFiles: string[] = [];

  const add = (key: string, item: RNFS.ReadDirItem) => {
    serversMap[key] = getModifiedTime(item);
    serverFiles.push(key);
  };

  const serversDirItems = await RNFS.readDir(serversDir);

  const topLevelServerEntrances = findTopLevelEntrances(serversDirItems);

  await Promise.all(
    serversDirItems.map(async item => {
      if (!item.isDirectory()) {
        if (isJsonFile(item)) {
          add(item.name, item);
        }
        return;
      }

      if (topLevelServerEntrances.has(item.name)) {
        return;
      }

      const serverDirName = item.name;
      const serverDirPath = `${serversDir}/${serverDirName}`;
      const serverDirItems = await RNFS.readDir(serverDirPath);

      for (const subItem of serverDirItems) {
        if (!subItem.isDirectory() && isJsonFile(subItem)) {
          add(`${serverDirName}/${subItem.name}`, subItem);
        }
      }
    }),
  );

  return {
    serversMap,
    serverFiles,
  };
}
