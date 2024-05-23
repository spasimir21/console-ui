import { getCurrentComponentContext } from '../component/ComponentContext';
import { Value, cleanup, computed, getValue } from '../../reactivity';
import { useCallback } from './useCallback';
import { useCleanup } from './useCleanup';

function useValue<T>(value: Value<T>, context = getCurrentComponentContext()) {
  const node = computed(useCallback(() => getValue(value), context));

  useCleanup(() => cleanup(node), context);

  return node;
}

export { useValue };
