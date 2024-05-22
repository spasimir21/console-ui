import { popComponentContext, pushComponentContext } from './ComponentContext';
import { TerminalScreen } from '../rendering/TerminalScreen';
import { getValue } from '../../reactivity';

type Component<T = Record<string, any>> = {
  mount(screen: TerminalScreen): void;
  cleanup(): void;
} & T;

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

    const component: Component = {
      mount(screen) {
        for (const onMount of context.onMountCallbacks) onMount(screen);
        for (const child of children) child.mount(screen);
      },
      cleanup() {
        for (const child of children) child.cleanup();
        for (const cleanup of context.cleanups) cleanup();
      }
    };

    for (const name in context.exports)
      Object.defineProperty(component, name, {
        configurable: false,
        enumerable: true,
        get: () => getValue(context.exports[name])
      });

    return component as Component<TExports>;
  };
}

const defineComponentsExports = <T>() => null as any as T;

export { Component, ComponentFunction, defineComponentsExports };
