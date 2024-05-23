import { popComponentContext, pushComponentContext } from './ComponentContext';
import { Component } from './Component';

function ShellComponent<TArgs extends any[], TOgExports = {}, TNewExports = {}>(
  componentFunction: (...args: TArgs) => Component<TOgExports>,
  _exports?: TNewExports
) {
  return (...args: TArgs): Component<TOgExports & TNewExports> => {
    pushComponentContext();
    const component = componentFunction(...args);
    const newContext = popComponentContext();

    const ogContext = component.context;

    for (const onMount of newContext.onMountCallbacks) ogContext.onMountCallbacks.push(onMount);
    for (const cleanup of newContext.cleanups) ogContext.cleanups.push(cleanup);

    for (const [name, getter] of newContext.exports)
      Object.defineProperty(component, name, {
        configurable: false,
        enumerable: true,
        get: getter
      });

    return component as any;
  };
}

export { ShellComponent };
