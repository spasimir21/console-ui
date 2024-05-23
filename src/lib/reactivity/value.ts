import { computed } from './shorthand/computed';
import { ReadableNode } from './nodes/node';

type Value<T> = T | (() => T) | ReadableNode<T>;

// prettier-ignore
const getValue = <T>(value: Value<T>): T =>
    typeof value === 'function' ? (value as any)()
  : typeof value === 'object' && value != null && 'value' in value ? value.value
  : value;

const valueToComputed = <T>(value: Value<T>) => computed(() => getValue(value));

export { Value, getValue, valueToComputed };
