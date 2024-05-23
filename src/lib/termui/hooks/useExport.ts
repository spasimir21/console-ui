import { getCurrentComponentContext } from '../component/ComponentContext';
import { Value, getValue } from '../../reactivity';
import { useCallback } from './useCallback';

const useExport = <T>(name: string, value: Value<T>, context = getCurrentComponentContext()) =>
  context.exports.set(
    name,
    useCallback(() => getValue(value), context)
  );

export { useExport };
