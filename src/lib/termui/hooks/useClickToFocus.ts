import { getCurrentComponentContext } from '../component/ComponentContext';
import { MousePress, useMousepressHandler } from './useMousepressHandler';
import { ReadableNode, WritableNode } from '../../reactivity';

const useClickToFocus = (
  name: string,
  focused: WritableNode<string>,
  x: ReadableNode<number>,
  y: ReadableNode<number>,
  width: ReadableNode<number>,
  height: ReadableNode<number>,
  callback?: (press: MousePress) => void,
  context = getCurrentComponentContext()
) =>
  useMousepressHandler(press => {
    if (press.release !== false || press.button !== 0) return;

    if (press.x < $x || press.x >= $x + $width || press.y <= $y || press.y > $y + $height) return;

    $focused = name;
    if (callback) callback(press);
  }, context);

export { useClickToFocus };
