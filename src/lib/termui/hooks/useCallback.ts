import { getCurrentComponentContext, popComponentContext, pushComponentContext } from '../component/ComponentContext';

const useCallback = <T extends (...args: any[]) => any>(callback: T, context = getCurrentComponentContext()) =>
  ((...args: any[]) => {
    pushComponentContext(context);
    const result = callback(...args);
    popComponentContext();
    return result;
  }) as T;

export { useCallback };
