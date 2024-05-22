import { getCurrentComponentContext } from '../component/ComponentContext';
import { StateOptions, cleanup, state } from '../../reactivity';
import { useCleanup } from './useCleanup';

function useState<T>(initialValue: T, options?: StateOptions, context = getCurrentComponentContext()) {
  const value = state(initialValue, options);

  useCleanup(() => cleanup(value), context);

  return value;
}

export { useState };
