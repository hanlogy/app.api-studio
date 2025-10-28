import RNFS, {ReadDirItem} from 'react-native-fs';

interface FileSnapshot {
  [key: string]: number | FileSnapshot;
}

const snapshot = async (dir: string): Promise<FileSnapshot> => {
  const files: ReadDirItem[] = await RNFS.readDir(dir);
  const map: FileSnapshot = {};

  for (const {name, path, isDirectory, mtime} of files) {
    if (isDirectory() && name === 'apis') {
      map[name] = await snapshot(path);
    } else if (name.endsWith('.json')) {
      map[name] = mtime?.getTime() ?? 0;
    }
  }

  return map;
};

export const watchWorkspace = async (
  dir: string,
  onChange: (snapshot: FileSnapshot) => void,
) => {
  const interval = 2000;

  let prev = await snapshot(dir);
  onChange(prev);

  const timer = setInterval(async () => {
    const next = await snapshot(dir);
    if (JSON.stringify(next) !== JSON.stringify(prev)) {
      prev = next;
      onChange(next);
    }
  }, interval);

  return {stop: () => clearInterval(timer)};
};

export type WorkspaceWatcher = Awaited<ReturnType<typeof watchWorkspace>>;
