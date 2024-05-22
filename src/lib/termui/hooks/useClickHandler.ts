import { getCurrentComponentContext } from '../component/ComponentContext';
import { useCallback } from './useCallback';
import { useCleanup } from './useCleanup';

interface ClickInfo {}

function useClickHandler(handler: (info: ClickInfo) => void, context = getCurrentComponentContext()) {
  const newHandler = useCallback((info?: ClickInfo) => {
    if (info == null) return;
    handler(info);
  }, context);

  process.stdin.on('mousepress', newHandler);

  const cleanup = () => process.stdin.off('mousepress', newHandler);

  useCleanup(cleanup, context);

  return cleanup;
}

export { useClickHandler, ClickInfo };
