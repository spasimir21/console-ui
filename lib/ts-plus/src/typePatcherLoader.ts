import { TypePatcherFactory, typePatcherFactoryM } from './typePatcher';
import ts, { TS } from './tsModuleStack';
import { tsRequire } from './tsRequire';
import { dirname } from 'path';

interface TypePatcherPlugin {
  typePatcherFactory: TypePatcherFactory;
  options: any;
}

function getBaseDirFromProgram(program: TS.Program, host: TS.ModuleResolutionHost) {
  const compilerOptions = program.getCompilerOptions();

  let baseDir =
    (compilerOptions.configFilePath as string | undefined) && dirname(compilerOptions.configFilePath as string);

  if (baseDir == null) {
    const rootFiles = program.getRootFileNames();
    if (rootFiles.length > 0) baseDir = ts.findConfigFile(dirname(rootFiles[0]), host.fileExists);
  }

  return baseDir ?? process.cwd();
}

function loadTypePatchersFromProgram(program: TS.Program, host: TS.ModuleResolutionHost) {
  const compilerOptions = program.getCompilerOptions();

  const baseDir = getBaseDirFromProgram(program, host);

  const plugins = ((compilerOptions.plugins as any[]) ?? [])
    .map((plugin: any) => {
      if (!plugin.transform) return null;

      try {
        const _module = tsRequire(plugin.transform, baseDir);

        const transformerFactory = _module[plugin.import ?? 'default'];
        if (transformerFactory == null) return null;

        const typePatcherFactory = typePatcherFactoryM.get(transformerFactory);
        if (typePatcherFactory == null) return null;

        return {
          typePatcherFactory,
          options: plugin
        } satisfies TypePatcherPlugin;
      } catch {
        return null;
      }
    })
    .filter(plugin => plugin != null) as TypePatcherPlugin[];

  return plugins.map(plugin => plugin.typePatcherFactory(plugin.options));
}

export { loadTypePatchersFromProgram, getBaseDirFromProgram, TypePatcherPlugin };
