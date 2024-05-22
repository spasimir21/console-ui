import { getCurrentComponentContext } from '../component/ComponentContext';
import { Value } from '../../reactivity';

const useExport = <T>(name: string, value: Value<T>, context = getCurrentComponentContext()) =>
  (context.exports[name] = value);

export { useExport };
