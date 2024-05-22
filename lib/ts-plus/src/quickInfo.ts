import { createMetadata } from './metadata';
import { TS } from './tsModuleStack';

type QuickInfoPatch = (info?: TS.QuickInfo) => TS.QuickInfo | null | undefined;

const quickInfoM = createMetadata<QuickInfoPatch>('QUICK_INFO');

const setQuickInfoOfNode = (node: TS.Node, patch: QuickInfoPatch) => quickInfoM.set(node, patch);

const getQuickInfoOfNode = (node: TS.Node) => quickInfoM.get(node);

export { setQuickInfoOfNode, getQuickInfoOfNode, QuickInfoPatch };
