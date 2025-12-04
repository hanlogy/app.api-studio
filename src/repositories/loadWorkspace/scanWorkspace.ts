import {
  WORKSPACE_COLLECTIONS_DIR,
  WORKSPACE_CONFIG_FILE,
  WORKSPACE_SERVERS_DIR,
} from '@/definitions';
import RNFS from 'react-native-fs';
import type { ScanWorkspaceResult } from './types';
import { findDir, findFile, getModifiedTime } from './helpers';
import { scanCollections } from './scanCollections';
import { scanServers } from './scanServers';

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

  const serversDir = findDir(rootItems, WORKSPACE_SERVERS_DIR);

  const { serversMap, serverFiles } = serversDir
    ? await scanServers(serversDir.path)
    : { serversMap: {}, serverFiles: [] };

  return {
    timestamps: {
      config: getModifiedTime(configFileObject),
      collections: collectionsMap,
      servers: serversMap,
    },
    files: {
      config: WORKSPACE_CONFIG_FILE,
      collections: collectionFiles,
      servers: serverFiles,
    },
  };
}
