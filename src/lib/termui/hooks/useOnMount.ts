import { getCurrentComponentContext } from '../component/ComponentContext';
import { TerminalScreen } from '../rendering/TerminalScreen';
import { useCallback } from './useCallback';

const useOnMount = (onMount: (screen: TerminalScreen) => void, context = getCurrentComponentContext()) =>
  context.onMountCallbacks.push(useCallback(onMount, context));

export { useOnMount };
