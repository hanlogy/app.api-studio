import RNFS from 'react-native-fs';
import type { SupportedScript } from './definitions';

export async function scanScriptsDir(
  dir: string,
  supportedScripts: readonly SupportedScript[],
) {
  if (!(await RNFS.exists(dir))) {
    return null;
  }

  const files = await RNFS.readDir(dir);

  const timestamps: Partial<Record<SupportedScript, number>> = {};
  const scriptFiles: SupportedScript[] = [];

  for (const { isDirectory, name, mtime } of files) {
    if (isDirectory() || !supportedScripts.find(e => e === name)) {
      continue;
    }
    const scriptFile = name as SupportedScript;

    timestamps[scriptFile] = mtime?.getTime() ?? 0;
    scriptFiles.push(scriptFile);
  }

  if (!scriptFiles.length) {
    return null;
  }

  return {
    timestamps,
    files: scriptFiles,
  };
}

export type ScanScriptsDirResult = Awaited<ReturnType<typeof scanScriptsDir>>;
