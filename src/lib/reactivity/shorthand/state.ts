import { StateNode, StateOptions } from '../nodes/StateNode';

const state = <T>(initialValue: T, options?: StateOptions) => new StateNode<T>(initialValue, options);

export { state };
