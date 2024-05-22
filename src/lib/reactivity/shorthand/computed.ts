import { ComputedNode, ComputedOptions } from '../nodes/ComputedNode';

const computed = <T>(getter: () => T, options?: ComputedOptions) => new ComputedNode<T>(getter, options);

export { computed };
