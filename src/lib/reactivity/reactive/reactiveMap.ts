import { markReactive } from '../reactiveFlag';
import { setRaw } from '../raw';

// TODO
function makeMapReactive<T extends Map<any, any>>(map: T, depth: number): T {
  markReactive(map);
  setRaw(map, map);

  return map;
}

export { makeMapReactive };
