import { ComponentContext, popComponentContext, pushComponentContext } from './ComponentContext';
import { TerminalScreen } from '../rendering/TerminalScreen';

type Component<T = Record<string, any>> = {
  mount(screen: TerminalScreen): void;
  cleanup(): void;
  readonly context: ComponentContext;
} & Readonly<T>;

type ComponentFunction<TArgs extends any[] = any[]> = (
  ...args: TArgs
) => Component | Component[] | null | undefined | void;

function Component<TArgs extends any[], TExports = {}>(
  componentFunction: ComponentFunction<TArgs>,
  _exports?: TExports
) {
  return (...args: TArgs): Component<TExports> => {
    pushComponentContext();
    const returnedChildren = componentFunction(...args);
    const context = popComponentContext();

    // prettier-ignore
    const children: Component[] =
        returnedChildren == null ? []
      : Array.isArray(returnedChildren) ? returnedChildren
      : [returnedChildren];

    let isMounted = false;
    let isDead = false;

    const component: Component = {
      mount(screen) {
        if (isMounted) return;
        isMounted = true;

        for (const onMount of context.onMountCallbacks) onMount(screen);
        for (const child of children) child.mount(screen);
      },
      cleanup() {
        if (isDead) return;
        isDead = true;

        for (const child of children) child.cleanup();
        for (const cleanup of context.cleanups) cleanup();
      },
      context
    };

    for (const [name, getter] of context.exports)
      Object.defineProperty(component, name, {
        configurable: false,
        enumerable: true,
        get: getter
      });

    return component as Component<TExports>;
  };
}

const defineComponentExports = <T>() => null as any as T;

export { Component, ComponentFunction, defineComponentExports };
