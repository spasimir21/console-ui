import { ComputedNode } from './nodes/ComputedNode';
import { StateNode } from './nodes/StateNode';

type ValueNode<T> = StateNode<T> | ComputedNode<T>;

type Value<T> = T | (() => T) | ValueNode<T>;

// prettier-ignore
const getValue = <T>(value: Value<T>): T =>
    typeof value === 'function' ? (value as any)()
  : typeof value === 'object' && value != null && 'value' in value ? value.value
  : value;

export { ValueNode, Value, getValue };
