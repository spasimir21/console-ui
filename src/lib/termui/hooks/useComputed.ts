import { getCurrentComponentContext } from '../component/ComponentContext';
import { ComputedOptions, cleanup, computed } from '../../reactivity';
import { useCallback } from './useCallback';
import { useCleanup } from './useCleanup';

function useComputed<T>(getter: () => T, options?: ComputedOptions, context = getCurrentComponentContext()) {
  const value = computed(useCallback(getter, context), options);

  useCleanup(() => cleanup(value), context);

  return value;
}

export { useComputed };
