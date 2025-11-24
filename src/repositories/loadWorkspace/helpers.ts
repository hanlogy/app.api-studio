import RNFS from 'react-native-fs';

const fileTypeMap = {
  '.test.json': 'tests',
  '.test.js': 'scriptTest',
  '.json': 'config',
  '.md': 'doc',
} as const;

export function parseRequestFileName(file: string) {
  for (const [extension, fileType] of Object.entries(fileTypeMap)) {
    if (file.endsWith(extension)) {
      const fileName = file.slice(0, -extension.length);
      return {
        fileType,
        fileNameParts: fileName.split('/'),
      };
    }
  }

  throw new Error('never');
}

export function getModifiedTime(item: { mtime: Date | undefined }) {
  return item.mtime?.getTime() ?? 0;
}

export function isJsonFile(item: string | { name: string }) {
  const name = typeof item === 'string' ? item : item.name;
  return name.endsWith('.json');
}

export function findFile(items: RNFS.ReadDirItem[], name: string) {
  return items.find(e => e.name === name && !e.isDirectory());
}

export function findDir(items: RNFS.ReadDirItem[], name: string) {
  return items.find(e => e.name === name && e.isDirectory());
}

export function findTopLevelEntrances(items: RNFS.ReadDirItem[]) {
  return new Set(
    items
      .filter(e => !e.isDirectory() && isJsonFile(e))
      .map(e => e.name.replace(/\.json$/, '')),
  );
}

export function findRequestExtras(items: RNFS.ReadDirItem[], baseName: string) {
  const exts = [
    `${baseName}.md`,
    `${baseName}.test.json`,
    `${baseName}.test.js`,
  ];
  return items.filter(f => !f.isDirectory() && exts.includes(f.name));
}
