import { EffectCallback, EffectOptions, cleanup, effect } from '../../reactivity';
import { getCurrentComponentContext } from '../component/ComponentContext';
import { useCallback } from './useCallback';
import { useCleanup } from './useCleanup';

function useEffect(callback: EffectCallback, options?: EffectOptions, context = getCurrentComponentContext()) {
  const value = effect(useCallback(callback, context), options);

  useCleanup(() => cleanup(value), context);

  return value;
}

export { useEffect };
