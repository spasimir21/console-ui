import { TerminalScreen } from '../rendering/TerminalScreen';
import { ReadableNode } from '../../reactivity';
import { Stack } from '../utils/Stack';

interface ComponentContext {
  readonly onMountCallbacks: ((screen: TerminalScreen) => void)[];
  readonly cleanups: (() => void)[];
  readonly exports: Map<string, () => any>;
  readonly contextValues: Map<symbol, ReadableNode<any>>;
}

const COMPONENT_CONTEXT_STACK = new Stack<ComponentContext>();

function createComponentContext(): ComponentContext {
  const context = { onMountCallbacks: [], cleanups: [], exports: new Map(), contextValues: new Map() };

  const parentContext = getCurrentComponentContext(false);
  if (parentContext != null)
    for (const [symbol, node] of parentContext.contextValues) context.contextValues.set(symbol, node);

  return context;
}

const pushComponentContext = (context?: ComponentContext) =>
  COMPONENT_CONTEXT_STACK.push(context ?? createComponentContext());

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
