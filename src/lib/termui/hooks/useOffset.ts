import { getCurrentComponentContext } from '../component/ComponentContext';
import { makeReactive } from '../../reactivity';
import { useExport } from './useExport';

type WithOffset<T = {}> = {
  setOffset: (x: number, y: number) => void;
} & T;

function useOffset(context = getCurrentComponentContext()) {
  const offset = makeReactive({ x: 0, y: 0 });

  const setOffset = (x: number, y: number) => {
    offset.x = x;
    offset.y = y;
  };

  useExport('setOffset', () => setOffset, context);

  return offset;
}

export { useOffset, WithOffset };
