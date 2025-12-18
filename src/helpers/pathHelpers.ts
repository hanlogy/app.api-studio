type PathParts = (string | number)[];

export function joinPath(args: PathParts): string;
export function joinPath(...args: PathParts): string;
export function joinPath(...input: [PathParts] | PathParts): string {
  const parts = (Array.isArray(input[0]) ? input[0] : input)
    .filter(Boolean)
    .map(String);
  return normalizePath(parts.join('/'));
}

// Remove the duplicated slash and the tailing slash
export function normalizePath(path: string): string {
  return path.replace(/\/+/g, '/').replace(/\/$/, '');
}

export function getDirFromFilePath(filePath: string): string {
  filePath = normalizePath(filePath);

  const lastSlashIndex = filePath.lastIndexOf('/');

  return filePath.slice(0, lastSlashIndex);
}

export function resolvePath({
  absoluteDir,
  relativePath,
}: {
  absoluteDir: string;
  relativePath: string;
}): string {
  absoluteDir = normalizePath(absoluteDir);

  // Treat absolute path as current.
  relativePath = normalizePath(relativePath).replace(/^\//, '');

  const baseParts = absoluteDir.split('/').filter(Boolean);
  const relParts = relativePath.split('/');

  for (const part of relParts) {
    if (!part || part === '.') {
      continue;
    }
    if (part === '..') {
      if (baseParts.length > 0) {
        baseParts.pop();
      }
    } else {
      baseParts.push(part);
    }
  }

  return '/' + baseParts.join('/');
}
