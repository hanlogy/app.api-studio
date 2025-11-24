import RNFS from 'react-native-fs';
import {
  findFile,
  findRequestExtras,
  findTopLevelEntrances,
  getModifiedTime,
  isJsonFile,
} from './helpers';

export async function scanCollections(collectionsDir: string) {
  const collectionsMap: Record<string, number> = {};
  const collectionFiles: string[] = [];

  const add = (key: string, item: RNFS.ReadDirItem) => {
    collectionsMap[key] = getModifiedTime(item);
    collectionFiles.push(key);
  };

  const collectionsDirItems = await RNFS.readDir(collectionsDir);
  const topLevelCollectionsEntrances =
    findTopLevelEntrances(collectionsDirItems);

  await Promise.all(
    collectionsDirItems.map(async collectionsDirItem => {
      if (!collectionsDirItem.isDirectory()) {
        if (isJsonFile(collectionsDirItem)) {
          add(collectionsDirItem.name, collectionsDirItem);

          const docFileName = collectionsDirItem.name.replace(/\.json$/, '.md');
          const docFileItem = findFile(collectionsDirItems, docFileName);
          if (docFileItem) {
            add(docFileName, docFileItem);
          }
        }
        return;
      }

      if (topLevelCollectionsEntrances.has(collectionsDirItem.name)) {
        return;
      }

      const collectionDirPath = `${collectionsDir}/${collectionsDirItem.name}`;
      const collectionDirItems = await RNFS.readDir(collectionDirPath);

      const collectionConfigFileName = `${collectionsDirItem.name}.json`;
      const collectionConfigItem = findFile(
        collectionDirItems,
        collectionConfigFileName,
      );
      if (!collectionConfigItem) {
        return;
      }

      add(
        `${collectionsDirItem.name}/${collectionConfigFileName}`,
        collectionConfigItem,
      );

      const collectionDocFileName = `${collectionsDirItem.name}.md`;
      const collectionDocFileItem = findFile(
        collectionDirItems,
        collectionDocFileName,
      );
      if (collectionDocFileItem) {
        const collectionDoc = `${collectionsDirItem.name}/${collectionDocFileName}`;
        add(collectionDoc, collectionDocFileItem);
      }

      const topLevelRequestsEntrances = new Set(
        Array.from(findTopLevelEntrances(collectionDirItems)).filter(
          // We need to exclude the collection config file, in case the request
          // folder has the same name of the collection name.
          e => e !== collectionsDirItem.name,
        ),
      );

      await Promise.all(
        collectionDirItems.map(async collectionDirItem => {
          if (!collectionDirItem.isDirectory()) {
            if (
              isJsonFile(collectionDirItem) &&
              collectionDirItem.name !== collectionConfigFileName
            ) {
              const requestFile = `${collectionsDirItem.name}/${collectionDirItem.name}`;

              add(requestFile, collectionDirItem);

              const extras = findRequestExtras(
                collectionDirItems,
                collectionDirItem.name.replace(/\.json$/, ''),
              );
              for (const extra of extras) {
                add(`${collectionsDirItem.name}/${extra.name}`, extra);
              }
            }
            return;
          }

          if (topLevelRequestsEntrances.has(collectionDirItem.name)) {
            return;
          }

          const requestDirPath = `${collectionDirPath}/${collectionDirItem.name}`;
          const requestDirItems = await RNFS.readDir(requestDirPath);

          const requestConfigFileName = `${collectionDirItem.name}.json`;
          const requestConfigItem = findFile(
            requestDirItems,
            requestConfigFileName,
          );
          if (!requestConfigItem) {
            return;
          }

          const prefix = `${collectionsDirItem.name}/${collectionDirItem.name}`;
          add(`${prefix}/${requestConfigFileName}`, requestConfigItem);

          const extras = findRequestExtras(
            requestDirItems,
            collectionDirItem.name,
          );
          for (const extra of extras) {
            add(`${prefix}/${extra.name}`, extra);
          }
        }),
      );
    }),
  );

  return {
    collectionsMap,
    collectionFiles,
  };
}
