import { LanguageServicePatches, applyLanguageServicePatches } from './languageServicePatch';
import { getQuickInfoAtPositionPatch } from './patches/getQuickInfoAtPosition';
import { getSemanticDiagnosticsPatch } from './patches/getSemanticDiagnostics';
import { getProgramPatch } from './patches/getProgram';
import type TS from 'typescript/lib/tsserverlibrary';
import { createLog } from './utils/log';

const PLUGIN_NAME = 'ts-plus';

const PATCHES: LanguageServicePatches = {
  getProgram: getProgramPatch,
  getQuickInfoAtPosition: getQuickInfoAtPositionPatch,
  getSemanticDiagnostics: getSemanticDiagnosticsPatch
};

const init: TS.server.PluginModuleFactory = ({ typescript }) => ({
  create: info => applyLanguageServicePatches(typescript, info, createLog(PLUGIN_NAME, info), PATCHES)
});

export = init;
