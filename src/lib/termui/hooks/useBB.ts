import { getCurrentComponentContext } from '../component/ComponentContext';
import { ReadableNode, Value, makeReactive } from '../../reactivity';
import { Alignment, fixAlignment } from '../alignAndJustify';
import { Component } from '../component/Component';
import { useComputed } from './useComputed';
import { useValue } from './useValue';
import { useExport } from './useExport';

interface BBConfig {
  x?: number;
  y?: number;
  xAlign?: Alignment;
  yAlign?: Alignment;
}

type WithBB<T = {}> = {
  x: number;
  y: number;
  width: number;
  height: number;
  setOffset: (x: number, y: number) => void;
} & T;

type BBComponent<T = {}> = Component<WithBB<T>>;

function useBB(
  config: ReadableNode<BBConfig>,
  widthValue: Value<number>,
  heightValue: Value<number>,
  context = getCurrentComponentContext()
) {
  const offset = makeReactive({ x: 0, y: 0 });

  const setOffset = (x: number, y: number) => {
    offset.x = x;
    offset.y = y;
  };

  const width = useValue(widthValue, context);
  const height = useValue(heightValue, context);

  const x = useComputed(() => fixAlignment(($config.x ?? 0) + offset.x, $width, $config.xAlign ?? Alignment.Start));
  const y = useComputed(() => fixAlignment(($config.y ?? 0) + offset.y, $height, $config.yAlign ?? Alignment.Start));

  useExport('setOffset', () => setOffset, context);
  useExport('x', x, context);
  useExport('y', y, context);
  useExport('width', width, context);
  useExport('height', height, context);

  return { width, height, x, y };
}

export { useBB, BBConfig, WithBB, BBComponent };
