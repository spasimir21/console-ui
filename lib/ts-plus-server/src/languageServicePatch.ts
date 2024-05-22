import { createMethodProxy } from './utils/methodProxy';
import type TS from 'typescript/lib/tsserverlibrary';
import { Log } from './utils/log';

type LanguageServicePatch<T extends keyof TS.LanguageService> = (
  ts: typeof TS,
  info: TS.server.PluginCreateInfo,
  log: Log
) => TS.LanguageService[T];

type LanguageServicePatches = {
  [T in keyof TS.LanguageService]?: LanguageServicePatch<T>;
};

const applyLanguageServicePatches = (
  ts: typeof TS,
  info: TS.server.PluginCreateInfo,
  log: Log,
  patches: LanguageServicePatches
) => {
  const proxy = createMethodProxy(info.languageService);

  // @ts-ignore
  for (const patchName in patches) proxy[patchName] = patches[patchName](ts, info, log);

  return proxy;
};

export { LanguageServicePatch, LanguageServicePatches, applyLanguageServicePatches };
