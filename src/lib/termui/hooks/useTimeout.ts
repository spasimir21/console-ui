import { getCurrentComponentContext } from '../component/ComponentContext';
import { useCallback } from './useCallback';
import { useCleanup } from './useCleanup';

function useTimeout(callback: () => void, ms?: number, context = getCurrentComponentContext()) {
  const timeout = setTimeout(useCallback(callback, context), ms);

  useCleanup(() => clearTimeout(timeout), context);

  return timeout;
}

export { useTimeout };
