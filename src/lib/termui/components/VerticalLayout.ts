import { Component, defineComponentExports } from '../component/Component';
import { Alignment, Justify, calculateJustify } from '../alignAndJustify';
import { BBComponent, BBConfig, WithBB, useBB } from '../hooks/useBB';
import { useEffect } from '../hooks/useEffect';
import { useValue } from '../hooks/useValue';
import { Value } from '../../reactivity';

interface VerticalLayoutConfig extends BBConfig {
  width?: number;
  height?: number;
  padX?: number;
  padY?: number;
  itemsAlign?: Alignment;
  justify?: Justify;
  gap?: number;
}

const VerticalLayout = Component((configValue: Value<VerticalLayoutConfig>, children: BBComponent[]) => {
  const config = useValue(configValue);

  const { x, y, width, height } = useBB(
    config,
    () => $config.width ?? Math.max(...children.map(child => child.width)) + ($config.padX ?? 0) * 2,
    () =>
      $config.height ??
      children.map(child => child.height).reduce((a, b) => a + b, 0) +
        ($config.gap ?? 0) * (children.length - 1) +
        ($config.padY ?? 0) * 2
  );

  useEffect(() => {
    // prettier-ignore
    const xOffset =
        $config.itemsAlign === Alignment.Center ? Math.floor($width / 2)
      : $config.itemsAlign === Alignment.End ? $width - ($config.padX ?? 0)
      : $config.padX ?? 0;

    const yOffsets = calculateJustify(
      children.map(child => child.height),
      $height,
      $config.padY ?? 0,
      $config.gap ?? 0,
      $config.justify ?? Justify.Start
    );

    for (let i = 0; i < children.length; i++) children[i].setOffset($x + xOffset, $y + yOffsets[i]);
  });

  return children;
}, defineComponentExports<WithBB>());

export { VerticalLayout, VerticalLayoutConfig };
