import { createMetadata } from './metadata';
import { TS } from './tsModuleStack';

type TypePatcher = (getProgram: () => TS.Program, host: TS.ModuleResolutionHost, sourceFile: TS.SourceFile) => void;

type TypePatcherFactory<TOptions = {}> = (options: TOptions) => TypePatcher;

const typePatcherFactoryM = createMetadata<TypePatcherFactory<any>>('$TYPE_PATCHER_FACTORY');

const attachTypePatcherFactory = <TOptions = {}>(transformerFactory: any, factory: TypePatcherFactory<TOptions>) =>
  typePatcherFactoryM.set(transformerFactory, factory);

export { TypePatcher, TypePatcherFactory, attachTypePatcherFactory, typePatcherFactoryM };
