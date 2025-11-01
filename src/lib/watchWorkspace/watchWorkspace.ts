import {APIS_DIR, CONFIG_FILE, type WorkspaceFiles} from '@/definitions';
import RNFS from 'react-native-fs';

interface Snapshot {
  readonly [CONFIG_FILE]?: number;
  readonly apis?: Record<string, number>;
}

export async function createSnapshot(dir: string): Promise<Snapshot> {
  const files = await RNFS.readDir(dir);

  // Find config.json
  const configFile = files.find(
    ({name, isDirectory}) => name === CONFIG_FILE && !isDirectory(),
  );

  // Find apis folder
  const apisDir = files.find(
    ({name, isDirectory}) => name === APIS_DIR && isDirectory(),
  );

  let apisMap: Record<string, number> | undefined;

  if (apisDir) {
    apisMap = {};
    const apiFiles = await RNFS.readDir(apisDir.path);
    for (const {isDirectory, name, mtime} of apiFiles) {
      if (!isDirectory() && name.endsWith('.json')) {
        apisMap[name] = mtime?.getTime() ?? 0;
      }
    }
  }

  return {
    [CONFIG_FILE]: configFile?.mtime?.getTime(),
    apis: apisMap,
  };
}

const toFiles = (snapshot: Snapshot) => {
  return {
    config: snapshot[CONFIG_FILE] ? CONFIG_FILE : undefined,
    apis: snapshot.apis ? Object.keys(snapshot.apis) : undefined,
  };
};

export async function watchWorkspace(
  dir: string,
  onChange: (files: WorkspaceFiles) => void,
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

  return {stop: () => clearInterval(timer)};
}

export type WorkspaceWatcher = Awaited<ReturnType<typeof watchWorkspace>>;
