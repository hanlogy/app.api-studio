import {
  WORKSPACE_COLLECTIONS_DIR,
  WORKSPACE_CONFIG_FILE,
} from '@/definitions';
import RNFS from 'react-native-fs';
import type { ScanWorkspaceResult } from './types';
import { findDir, findFile, getModifiedTime } from './helpers';
import { scanCollections } from './scanCollections';

export async function scanWorkspace(
  dir: string,
): Promise<ScanWorkspaceResult | undefined> {
  const rootItems = await RNFS.readDir(dir);

  const configFileObject = findFile(rootItems, WORKSPACE_CONFIG_FILE);
  if (!configFileObject) {
    return undefined;
  }

  const collectionsDir = findDir(rootItems, WORKSPACE_COLLECTIONS_DIR);

  const { collectionsMap, collectionFiles } = collectionsDir
    ? await scanCollections(collectionsDir.path)
    : { collectionsMap: {}, collectionFiles: [] };

  return {
    timestamps: {
      config: getModifiedTime(configFileObject),
      collections: collectionsMap,
    },
    files: {
      config: WORKSPACE_CONFIG_FILE,
      collections: collectionFiles,
    },
  };
}
