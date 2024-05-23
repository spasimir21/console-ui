import { getCurrentComponentContext } from '../component/ComponentContext';
import { ReadableNode } from '../../reactivity';
import { useState } from './useState';

function createContextValue<T>() {
  const valueSymbol = Symbol();

  return [
    (value: T, context = getCurrentComponentContext()) => {
      const valueState = useState(value, undefined, context);
      context.contextValues.set(valueSymbol, valueState);
      return valueState;
    },
    (context = getCurrentComponentContext()) => {
      return context.contextValues.get(valueSymbol) as ReadableNode<T>;
    }
  ] as const;
}

export { createContextValue };
