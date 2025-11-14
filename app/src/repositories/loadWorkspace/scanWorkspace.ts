import {
  WORKSPACE_COLLECTIONS_DIR,
  WORKSPACE_CONFIG_FILE,
} from '@/definitions';
import RNFS from 'react-native-fs';

export async function scanWorkspace(dir: string) {
  const files = await RNFS.readDir(dir);

  // Find config.json
  const configFileObject = files.find(
    ({ name, isDirectory }) => name === WORKSPACE_CONFIG_FILE && !isDirectory(),
  );

  // Find collections folder
  const collectionsDir = files.find(
    ({ name, isDirectory }) =>
      name === WORKSPACE_COLLECTIONS_DIR && isDirectory(),
  );

  const collectionsMap: Record<string, number> = {};
  const collectionFilesNames: string[] = [];

  if (collectionsDir) {
    const collectionFiles = await RNFS.readDir(collectionsDir.path);
    for (const { isDirectory, name, mtime } of collectionFiles) {
      if (!isDirectory() && name.endsWith('.json')) {
        collectionsMap[name] = mtime?.getTime() ?? 0;
        collectionFilesNames.push(name);
      }
    }
  }

  return {
    timestamps: {
      config: configFileObject
        ? configFileObject.mtime?.getTime() ?? 0
        : undefined,
      collections: collectionsMap,
    },
    files: {
      config: configFileObject ? WORKSPACE_CONFIG_FILE : undefined,
      collections: collectionFilesNames,
    },
  };
}

export type ScanWorkspaceResult = Awaited<ReturnType<typeof scanWorkspace>>;
