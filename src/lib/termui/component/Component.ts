import { popComponentContext, pushComponentContext } from './ComponentContext';
import { TerminalScreen } from '../rendering/TerminalScreen';

interface Component {
  mount(screen: TerminalScreen): void;
  cleanup(): void;
}

type ComponentFunction<T extends any[] = any[]> = (...args: T) => Component | void;

const Component =
  <T extends any[]>(componentFunction: ComponentFunction<T>) =>
  (...args: T): Component => {
    pushComponentContext();
    const childComponent = componentFunction(...args);
    const context = popComponentContext();

    return {
      mount(screen) {
        for (const onMount of context.onMountCallbacks) onMount(screen);
        if (childComponent) childComponent.mount(screen);
      },
      cleanup() {
        if (childComponent) childComponent.cleanup();
        for (const cleanup of context.cleanups) cleanup();
      }
    };
  };

export { Component, ComponentFunction };
