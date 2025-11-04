import {
  WORKSPACE_COLLECTIONS_DIR,
  WORKSPACE_CONFIG_FILE,
  type WorkspaceFiles,
} from '@/definitions';
import RNFS from 'react-native-fs';

interface Snapshot {
  readonly [WORKSPACE_CONFIG_FILE]?: number;
  readonly collections?: Record<string, number>;
}

export async function createSnapshot(dir: string): Promise<Snapshot> {
  const files = await RNFS.readDir(dir);

  // Find config.json
  const configFile = files.find(
    ({ name, isDirectory }) => name === WORKSPACE_CONFIG_FILE && !isDirectory(),
  );

  // Find collections folder
  const collectionsDir = files.find(
    ({ name, isDirectory }) =>
      name === WORKSPACE_COLLECTIONS_DIR && isDirectory(),
  );

  let collectionsMap: Record<string, number> | undefined;

  if (collectionsDir) {
    collectionsMap = {};
    const collectionFiles = await RNFS.readDir(collectionsDir.path);
    for (const { isDirectory, name, mtime } of collectionFiles) {
      if (!isDirectory() && name.endsWith('.json')) {
        collectionsMap[name] = mtime?.getTime() ?? 0;
      }
    }
  }

  return {
    [WORKSPACE_CONFIG_FILE]: configFile?.mtime?.getTime(),
    collections: collectionsMap,
  };
}

const toFiles = (snapshot: Snapshot) => {
  return {
    config: snapshot[WORKSPACE_CONFIG_FILE] ? WORKSPACE_CONFIG_FILE : undefined,
    collections: snapshot.collections
      ? Object.keys(snapshot.collections)
      : undefined,
  };
};

export async function watchWorkspace(
  dir: string,
  onChange: (files: Partial<WorkspaceFiles>) => void,
) {
  const interval = 2000;

  let prev = await createSnapshot(dir);
  onChange(toFiles(prev));

  const timer = setInterval(async () => {
    const next = await createSnapshot(dir);
    if (JSON.stringify(next) !== JSON.stringify(prev)) {
      prev = next;
      onChange(toFiles(next));
    }
  }, interval);

  return { stop: () => clearInterval(timer) };
}

export type WorkspaceWatcher = Awaited<ReturnType<typeof watchWorkspace>>;
