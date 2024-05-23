import { TerminalScreen } from '../rendering/TerminalScreen';
import { Stack } from '../utils/Stack';

interface ComponentContext {
  readonly onMountCallbacks: ((screen: TerminalScreen) => void)[];
  readonly cleanups: (() => void)[];
  readonly exports: Record<string, () => any>;
}

const COMPONENT_CONTEXT_STACK = new Stack<ComponentContext>();

const pushComponentContext = (context?: ComponentContext) =>
  COMPONENT_CONTEXT_STACK.push(context ?? { onMountCallbacks: [], cleanups: [], exports: {} });

function getCurrentComponentContext(assertHasContext: false): ComponentContext | null;
function getCurrentComponentContext(assertHasContext?: true): ComponentContext;
function getCurrentComponentContext(assertHasContext = true) {
  const context = COMPONENT_CONTEXT_STACK.peek();
  if (assertHasContext && context == null) throw new Error(`This code must be executed inside of a component context!`);
  return context;
}

function popComponentContext(assertHasContext: false): ComponentContext | null;
function popComponentContext(assertHasContext?: true): ComponentContext;
function popComponentContext(assertHasContext = true) {
  const context = COMPONENT_CONTEXT_STACK.pop();
  if (assertHasContext && context == null) throw new Error(`This code must be executed inside of a component context!`);
  return context;
}

export { ComponentContext, pushComponentContext, getCurrentComponentContext, popComponentContext };
