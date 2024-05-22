import { getCurrentComponentContext } from '../component/ComponentContext';
import { TerminalScreen } from '../rendering/TerminalScreen';
import { useOnMount } from './useOnMount';
import { useState } from './useState';

function useScreen(context = getCurrentComponentContext()) {
  const screen = useState<TerminalScreen | null>(null, undefined, context);

  useOnMount(newScreen => {
    $screen = newScreen;
  }, context);

  return screen;
}

export { useScreen };
