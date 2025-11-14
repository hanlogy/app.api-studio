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

const findFile = (
  items: RNFS.ReadDirItem[],
  name: string,
): RNFS.ReadDirItem | undefined =>
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

  // Find config.json
  const configFileObject = findFile(rootItems, WORKSPACE_CONFIG_FILE);

  if (!configFileObject) {
    return undefined;
  }

  // Find collections folder
  const collectionsDir = rootItems.find(
    ({ name, isDirectory }) =>
      name === WORKSPACE_COLLECTIONS_DIR && isDirectory(),
  );

  const collectionsMap: Record<string, number> = {};
  const collectionFiles: string[] = [];

  const add = ({ key, item }: { key: string; item: RNFS.ReadDirItem }) => {
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

  for (const collectionsDirItem of collectionsDirItems) {
    if (!collectionsDirItem.isDirectory()) {
      // A collection file.
      if (isJson(collectionsDirItem)) {
        add({
          key: collectionsDirItem.name,
          item: collectionsDirItem,
        });

        const docFileName = collectionsDirItem.name.replace(/\.json$/, '.md');
        const docFileItem = findFile(collectionsDirItems, docFileName);
        if (docFileItem) {
          add({
            key: docFileName,
            item: docFileItem,
          });
        }
      }

      continue;
    }

    if (topLevelCollectionsEntrances.has(collectionsDirItem.name)) {
      continue;
    }

    const collectionDirPath = `${collectionsDir.path}/${collectionsDirItem.name}`;
    const collectionDirItems = await RNFS.readDir(collectionDirPath);
    const collectionConfigFileName = `${collectionsDirItem.name}.json`;
    const collectionConfigObj = findFile(
      collectionDirItems,
      collectionConfigFileName,
    );

    if (!collectionConfigObj) {
      // Ignore this folder if no config file found
      continue;
    }

    const collectionConfig = `${collectionsDirItem.name}/${collectionConfigFileName}`;
    add({
      key: collectionConfig,
      item: collectionConfigObj,
    });

    const collectionDocFileName = `${collectionsDirItem.name}.md`;
    const collectionDocObj = findFile(
      collectionDirItems,
      collectionDocFileName,
    );
    if (collectionDocObj) {
      const collectionDoc = `${collectionsDirItem.name}/${collectionDocFileName}`;
      add({
        key: collectionDoc,
        item: collectionDocObj,
      });
    }

    const topLevelRequestsEntrances = new Set(
      Array.from(findTopLevelEntrances(collectionDirItems)).filter(
        // We need to exclude the collection config file, in case the request
        // folder has the same name of the collection name.
        e => e !== collectionsDirItem.name,
      ),
    );

    // Find requests from a collection folder
    for (const collectionDirItem of collectionDirItems) {
      if (!collectionDirItem.isDirectory()) {
        if (
          isJson(collectionDirItem) &&
          collectionDirItem.name !== collectionConfigFileName
        ) {
          // A request file.
          const requestFile = `${collectionsDirItem.name}/${collectionDirItem.name}`;
          add({
            key: requestFile,
            item: collectionDirItem,
          });

          const extras = findRequestExtras(
            collectionDirItems,
            collectionDirItem.name.replace(/\.json$/, ''),
          );
          for (const extra of extras) {
            add({
              key: `${collectionsDirItem.name}/${extra.name}`,
              item: extra,
            });
          }
        }

        continue;
      }

      if (topLevelRequestsEntrances.has(collectionDirItem.name)) {
        continue;
      }

      // It might be a request dir
      const requestDirPath = `${collectionDirPath}/${collectionDirItem.name}`;
      const requestDirItems = await RNFS.readDir(requestDirPath);
      // Config file for this request
      const requestConfigFileName = `${collectionDirItem.name}.json`;
      const requestConfigObj = findFile(requestDirItems, requestConfigFileName);

      if (!requestConfigObj) {
        // Ignore this folder if no config file found
        continue;
      }

      const requestNameBase = collectionDirItem.name;
      const requestPrefix = `${collectionsDirItem.name}/${requestNameBase}`;

      add({
        key: `${requestPrefix}/${requestConfigFileName}`,
        item: requestConfigObj,
      });

      const extras = findRequestExtras(requestDirItems, requestNameBase);
      for (const extra of extras) {
        add({
          key: `${requestPrefix}/${extra.name}`,
          item: extra,
        });
      }
    }
  }

  return result;
}
