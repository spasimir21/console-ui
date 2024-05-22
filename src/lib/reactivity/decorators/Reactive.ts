import { addDependency, getDependencies, removeDependency } from '../dependencies';
import { applyDecorationsFromClass } from '../decorations/decorations';
import { Constructor } from '../utils/utilTypes';
import { markReactive } from '../reactiveFlag';

function Reactive(constructor: Constructor) {
  const proxy = new Proxy(constructor, {
    construct: (target, args, newTarget) => {
      const instance = Reflect.construct(target, args, newTarget);

      markReactive(instance);
      applyDecorationsFromClass(instance, constructor);

      return instance;
    }
  }) as any;

  const deps = new Set(getDependencies(constructor));

  for (const dep of deps) {
    removeDependency(constructor, dep);
    addDependency(proxy, dep);
  }

  return proxy;
}

export { Reactive };
