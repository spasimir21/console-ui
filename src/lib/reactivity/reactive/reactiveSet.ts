import { markReactive } from '../reactiveFlag';
import { setRaw } from '../raw';

// TODO
function makeSetReactive<T extends Set<any>>(set: T, depth: number): T {
  markReactive(set);
  setRaw(set, set);

  return set;
}

export { makeSetReactive };
