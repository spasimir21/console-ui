import { getCurrentComponentContext } from '../component/ComponentContext';
import { Alignment, fixAlignment } from '../alignAndSpace';
import { ReadableNode, Value } from '../../reactivity';
import { WithOffset, useOffset } from './useOffset';
import { Component } from '../component/Component';
import { WithSize, useSize } from './useSize';
import { useComputed } from './useComputed';
import { useValue } from './useValue';

interface BBConfig {
  x: number;
  y: number;
  horizontalAlign?: Alignment;
  verticalAlign?: Alignment;
}

type WithBB<T = {}> = WithSize<WithOffset<T>>;

type BBComponent<T = {}> = Component<WithBB<T>>;

function useBB(
  config: ReadableNode<BBConfig>,
  widthValue: Value<number>,
  heightValue: Value<number>,
  context = getCurrentComponentContext()
) {
  const offset = useOffset(context);

  useSize(widthValue, heightValue, context);

  const width = useValue(widthValue, context);
  const height = useValue(heightValue, context);

  const x = useComputed(() => fixAlignment($config.x + offset.x, $width, $config.horizontalAlign ?? Alignment.Start));

  const y = useComputed(() => fixAlignment($config.y + offset.y, $height, $config.verticalAlign ?? Alignment.Start));

  return { width, height, x, y };
}

export { useBB, BBConfig, WithBB, BBComponent };
