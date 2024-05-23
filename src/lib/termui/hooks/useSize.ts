import { getCurrentComponentContext } from '../component/ComponentContext';
import { Value } from '../../reactivity';
import { useExport } from './useExport';

type WithSize<T = {}> = {
  width: number;
  height: number;
} & T;

function useSize(width: Value<number>, height: Value<number>, context = getCurrentComponentContext()) {
  useExport('width', width, context);
  useExport('height', height, context);
}

export { useSize, WithSize };
