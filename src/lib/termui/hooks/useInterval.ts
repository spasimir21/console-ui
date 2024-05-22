import { getCurrentComponentContext } from '../component/ComponentContext';
import { useCallback } from './useCallback';
import { useCleanup } from './useCleanup';

function useInterval(callback: () => void, ms?: number, context = getCurrentComponentContext()) {
  const interval = setInterval(useCallback(callback, context), ms);

  useCleanup(() => clearInterval(interval), context);

  return interval;
}

export { useInterval };
