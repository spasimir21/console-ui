import { getCurrentComponentContext } from '../component/ComponentContext';
import { useCallback } from './useCallback';
import { useCleanup } from './useCleanup';

interface KeyPress {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
}

function useKeypressHandler(handler: (keypress: KeyPress) => void, context = getCurrentComponentContext()) {
  const newHandler = useCallback((_: any, keypress?: KeyPress) => {
    if (keypress == null) return;
    handler(keypress);
  }, context);

  process.stdin.on('keypress', newHandler);

  const cleanup = () => process.stdin.off('keypress', newHandler);

  useCleanup(cleanup, context);

  return cleanup;
}

export { useKeypressHandler, KeyPress };
