import { popComponentContext, pushComponentContext } from './ComponentContext';
import { TerminalScreen } from '../rendering/TerminalScreen';
import { useValue } from '../hooks/useValue';
import { Value } from '../../reactivity';
import { Component } from './Component';

function DynamicComponent<TComponent extends Component>(componentValue: Value<TComponent>): TComponent {
  pushComponentContext();
  const component = useValue(componentValue);
  const context = popComponentContext();

  let isMounted = false;
  let isDead = false;

  const shadowComponent: Component = {
    mount(screen) {
      if (isMounted) return;
      isMounted = true;

      for (const onMount of context.onMountCallbacks) onMount(screen);
    },
    cleanup() {
      if (isDead) return;
      isDead = true;

      for (const cleanup of context.cleanups) cleanup();
    },
    context
  };

  return new Proxy(shadowComponent as any, {
    get: (target, prop) => {
      if (prop in target) return target[prop as string];
      return $component[prop as string];
    },
    defineProperty: (target, property, attributes) => Reflect.defineProperty(target, property, attributes)
  });
}

export { DynamicComponent };
