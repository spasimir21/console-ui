import type { ProgramTransformerExtras, PluginConfig } from 'ts-patch';
import { loadTypePatchersFromProgram } from './typePatcherLoader';
import type {} from 'ts-expose-internals';
import ts from 'typescript';

const FILE_VERSIONS = new Map<string, string>();

const CURRENT_PROGRAM = new Map<string, ts.Program>();

function transformProgram(
  oldProgram: ts.Program,
  host: ts.CompilerHost,
  _options: PluginConfig,
  { ts }: ProgramTransformerExtras
) {
  const program = ts.createProgram(oldProgram.getRootFileNames(), oldProgram.getCompilerOptions(), host, oldProgram);

  const typePatchers = loadTypePatchersFromProgram(program as any, host);

  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) continue;
    CURRENT_PROGRAM.set(sourceFile.fileName, program);
    if (sourceFile.version != null && FILE_VERSIONS.get(sourceFile.fileName) === sourceFile.version) continue;
    if (sourceFile.version != null) FILE_VERSIONS.set(sourceFile.fileName, sourceFile.version);
    for (const patcher of typePatchers)
      patcher(() => CURRENT_PROGRAM.get(sourceFile.fileName) as any, host, sourceFile as any);
  }

  return program;
}

export default transformProgram;
