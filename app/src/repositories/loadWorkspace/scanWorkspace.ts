import {
  WORKSPACE_COLLECTIONS_DIR,
  WORKSPACE_CONFIG_FILE,
} from '@/definitions';
import RNFS from 'react-native-fs';

const getTime = (item: { mtime: Date | undefined }) =>
  item.mtime?.getTime() ?? 0;

const isJson = (item: string | { name: string }) => {
  const name = typeof item === 'string' ? item : item.name;
  return name.endsWith('.json');
};

const findFile = (items: RNFS.ReadDirItem[], name: string) =>
  items.find(e => e.name === name && !e.isDirectory());

const findTopLevelEntrances = (items: RNFS.ReadDirItem[]) =>
  new Set(
    items
      .filter(e => !e.isDirectory() && isJson(e))
      .map(e => e.name.replace(/\.json$/, '')),
  );

const findRequestExtras = (items: RNFS.ReadDirItem[], baseName: string) => {
  const exts = [
    `${baseName}.md`,
    `${baseName}.test.json`,
    `${baseName}.test.js`,
  ];
  return items.filter(f => !f.isDirectory() && exts.includes(f.name));
};

export interface Timestamps {
  config: number;
  collections: Record<string, number>;
}

export interface ScanWorkspaceResult {
  timestamps: Timestamps;
  files: {
    config: 'config.json';
    collections: string[];
  };
}

export async function scanWorkspace(
  dir: string,
): Promise<ScanWorkspaceResult | undefined> {
  const rootItems = await RNFS.readDir(dir);

  const configFileObject = findFile(rootItems, WORKSPACE_CONFIG_FILE);
  if (!configFileObject) {
    return undefined;
  }

  const collectionsDir = rootItems.find(
    ({ name, isDirectory }) =>
      name === WORKSPACE_COLLECTIONS_DIR && isDirectory(),
  );

  const collectionsMap: Record<string, number> = {};
  const collectionFiles: string[] = [];

  const add = (key: string, item: RNFS.ReadDirItem) => {
    collectionsMap[key] = getTime(item);
    collectionFiles.push(key);
  };

  const result = {
    timestamps: {
      config: getTime(configFileObject),
      collections: collectionsMap,
    },
    files: {
      config: WORKSPACE_CONFIG_FILE,
      collections: collectionFiles,
    },
  };

  if (!collectionsDir) {
    return result;
  }

  const collectionsDirItems = await RNFS.readDir(collectionsDir.path);
  const topLevelCollectionsEntrances =
    findTopLevelEntrances(collectionsDirItems);

  await Promise.all(
    collectionsDirItems.map(async collectionsDirItem => {
      if (!collectionsDirItem.isDirectory()) {
        if (isJson(collectionsDirItem)) {
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

      const collectionDirPath = `${collectionsDir.path}/${collectionsDirItem.name}`;
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
              isJson(collectionDirItem) &&
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

  return result;
}
