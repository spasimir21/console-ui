import { applyDecorationsFromClass } from './decorations/decorations';
import { makeObjectReactive } from './reactive/reactiveObject';
import { makeArrayReactive } from './reactive/reactiveArray';
import { isReactive, markReactive } from './reactiveFlag';
import { makeSetReactive } from './reactive/reactiveSet';
import { makeMapReactive } from './reactive/reactiveMap';
import { EqualityCheck, areIdentical } from './equal';
import { Constructor } from './utils/utilTypes';

function makeReactive<T>(value: T, depth: number = Infinity, equalityCheck: EqualityCheck = areIdentical): T {
  if (depth == 0 || value == null || typeof value !== 'object' || isReactive(value)) return value;

  markReactive(value);

  const valueConstructor = (Object.getPrototypeOf(value)?.constructor ?? Object) as Constructor;

  const makeValueReactive = MakeReactiveMap.get(valueConstructor);
  if (makeValueReactive) return makeValueReactive(value, depth - 1, equalityCheck);

  applyDecorationsFromClass(value, valueConstructor);

  return value;
}

const MakeReactiveMap = new Map<Constructor, (object: any, depth: number, equalityCheck: EqualityCheck) => any>([
  [Object, makeObjectReactive],
  [Array, makeArrayReactive],
  [Set, makeSetReactive],
  [Map, makeMapReactive]
]);

export { makeReactive, MakeReactiveMap };
