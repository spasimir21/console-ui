import { LanguageServicePatch } from '../languageServicePatch';
import {
  TS,
  TypePatcher,
  createMetadata,
  getBaseDirFromProgram,
  loadTypePatchersFromProgram,
  popTsModule,
  pushTsModule
} from 'ts-plus';

const TYPE_PATCHERS = new Map<string, TypePatcher[]>();

const CURRENT_PROGRAM = new Map<string, TS.Program>();

const isPatchedM = createMetadata<true>('IS_PATCHED');

const getProgramPatch: LanguageServicePatch<'getProgram'> = (ts, { languageService, languageServiceHost }, log) => {
  return () => {
    const program = languageService.getProgram() ?? null;
    if (program == null) return undefined;

    const baseDir = getBaseDirFromProgram(program, languageServiceHost);

    if (!TYPE_PATCHERS.has(baseDir))
      TYPE_PATCHERS.set(baseDir, loadTypePatchersFromProgram(program, languageServiceHost));

    const typePatchers = TYPE_PATCHERS.get(baseDir)!;

    pushTsModule(ts);
    for (const sourceFile of program.getSourceFiles()) {
      CURRENT_PROGRAM.set(sourceFile.fileName, program);
      if (sourceFile.isDeclarationFile || isPatchedM.get(sourceFile)) continue;
      isPatchedM.set(sourceFile, true);
      for (const patcher of typePatchers)
        patcher(() => CURRENT_PROGRAM.get(sourceFile.fileName) as any, languageServiceHost, sourceFile);
    }
    popTsModule();

    return program;
  };
};

export { getProgramPatch };
