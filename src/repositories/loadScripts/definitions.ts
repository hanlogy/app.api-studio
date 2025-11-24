export const supportedScripts = [
  'requestMiddleware.js',
  'mockServerMiddleware.js',
] as const;

export type SupportedScript = (typeof supportedScripts)[number];

export interface ScriptFunctions {
  requestMiddleware?: Function;
  mockServerMiddleware?: Function;
}
