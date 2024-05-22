import { markReactive } from '../reactiveFlag';
import { setRaw } from '../raw';

// TODO
function makeArrayReactive<T extends any[]>(array: T, depth: number): T {
  markReactive(array);
  setRaw(array, array);

  return array;
}

export { makeArrayReactive };
