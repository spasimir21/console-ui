import { getCurrentComponentContext } from '../component/ComponentContext';
import { useCallback } from './useCallback';
import { useCleanup } from './useCleanup';

interface MousePress {
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  sequence: string;
  code: string;
  x: number;
  y: number;
  scroll: number;
  button?: number;
  release: boolean;
}

function useMousepressHandler(handler: (mousepress: MousePress) => void, context = getCurrentComponentContext()) {
  const newHandler = useCallback((mousepress?: MousePress) => {
    if (mousepress == null) return;
    mousepress.x--;
    mousepress.y--;
    handler(mousepress);
  }, context);

  process.stdin.on('mousepress', newHandler);

  const cleanup = () => process.stdin.off('mousepress', newHandler);

  useCleanup(cleanup, context);

  return cleanup;
}

export { useMousepressHandler, MousePress };
