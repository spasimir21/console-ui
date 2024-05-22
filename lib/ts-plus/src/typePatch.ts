import { TS, createCallbackWithTsModule } from './tsModuleStack';
import { createMetadata } from './metadata';

const nodesPatchedM = createMetadata<Set<TS.Node>>('NODES_PATCHED');

function getPatchedNodes(typeChecker: TS.TypeChecker) {
  const patchedNodes = nodesPatchedM.get(typeChecker);
  if (patchedNodes != null) return patchedNodes;

  const newPatchedNodes = new Set<TS.Node>();
  nodesPatchedM.set(typeChecker, newPatchedNodes);
  return newPatchedNodes;
}

const synthIdM = createMetadata<number>('SYNTH_ID');

type TypePatch<T extends TS.Node> = (node: T, typeChecker: TS.TypeChecker, isInitial: boolean) => number | null;

function addTypePatch<T extends TS.Node>(
  node: T,
  getProgram: () => TS.Program,
  patch: TypePatch<T>,
  initialize = false
) {
  // @ts-ignore
  let originalId = node.id;
  let isChecking = false;
  let isInitial = true;

  const patchWithTsContext = createCallbackWithTsModule(patch);

  Object.defineProperty(node, 'id', {
    configurable: true,
    enumerable: true,
    set(value) {
      originalId = value;
    },
    get() {
      if (!isChecking) {
        isChecking = true;
        const typeChecker = getProgram().getTypeChecker();
        const patchedNodes = getPatchedNodes(typeChecker);

        if (!patchedNodes.has(node)) {
          const synthId = patchWithTsContext(node, typeChecker, isInitial);
          if (synthId != null) synthIdM.set(node, synthId);

          patchedNodes.add(node);
          isInitial = false;
        }

        isChecking = false;
      }

      return synthIdM.get(node) ?? originalId;
    }
  });

  // @ts-ignore
  if (initialize) node.id;
}

export { addTypePatch, TypePatch };
