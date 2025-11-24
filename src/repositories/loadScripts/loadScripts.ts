/* eslint-disable no-new-func */
import RNFS from 'react-native-fs';
import { scanScriptsDir } from './scanScriptsDir';
import {
  supportedScripts,
  type ScriptFunctions,
  type SupportedScript,
} from './definitions';

let timer: NodeJS.Timeout | null = null;

export async function loadScripts({
  workspaceDir,
  onSuccess,
}: {
  workspaceDir: string;
  onSuccess: (functions: ScriptFunctions) => void;
}) {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  const scriptsDir = `${workspaceDir}/scripts`;

  const interval = 2000;
  let snapshot: Partial<Record<SupportedScript, number>> | undefined;

  const scanAndBuild = async () => {
    const scanedResult = await scanScriptsDir(scriptsDir, supportedScripts);

    if (!scanedResult) {
      if (snapshot !== undefined) {
        onSuccess({
          requestMiddleware: undefined,
          mockServerMiddleware: undefined,
        });
        snapshot = undefined;
      }

      return;
    }

    const { timestamps, files } = scanedResult;
    if (snapshot && JSON.stringify(timestamps) === JSON.stringify(snapshot)) {
      return;
    }

    const functions: ScriptFunctions = {};

    if (!files.includes('requestMiddleware.js')) {
      functions.requestMiddleware = undefined;
    } else if (
      !snapshot ||
      timestamps['requestMiddleware.js'] !== snapshot['requestMiddleware.js']
    ) {
      try {
        let code = await RNFS.readFile(
          `${scriptsDir}/requestMiddleware.js`,
          'utf8',
        );
        code = `return (${code})(key, request, api);`;
        functions.requestMiddleware = new Function(
          'key',
          'request',
          'api',
          code,
        );
      } catch {
        //
      }
    }

    if (!files.includes('mockServerMiddleware.js')) {
      functions.mockServerMiddleware = undefined;
    } else if (
      !snapshot ||
      timestamps['mockServerMiddleware.js'] !==
        snapshot['mockServerMiddleware.js']
    ) {
      // TODO:
    }

    onSuccess(functions);

    snapshot = timestamps;
  };

  await scanAndBuild();

  timer = setInterval(scanAndBuild, interval);
}
