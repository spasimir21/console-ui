import { Component, defineComponentExports } from '../component/Component';
import { Alignment, Spacing, calculateSpacing } from '../alignAndSpace';
import { BBComponent, BBConfig, WithBB, useBB } from '../hooks/useBB';
import { useEffect } from '../hooks/useEffect';
import { useValue } from '../hooks/useValue';
import { Value } from '../../reactivity';

interface VerticalLayoutConfig extends BBConfig {
  width: number;
  height: number;
  padding: [number, number];
  itemsAlign?: Alignment;
  spacing?: Spacing;
  gap?: number;
}

const VerticalLayout = Component((configValue: Value<VerticalLayoutConfig>, children: BBComponent[]) => {
  const config = useValue(configValue);

  const { x, y, width, height } = useBB(
    config,
    () => $config.width,
    () => $config.height
  );

  useEffect(() => {
    // prettier-ignore
    const xOffset =
        $config.itemsAlign === Alignment.Center ? Math.round($width / 2)
      : $config.itemsAlign === Alignment.End ? $width
      : 0;

    const yOffsets = calculateSpacing(
      children.map(child => child.height),
      $height,
      $config.padding[1],
      $config.gap ?? 0,
      $config.spacing ?? Spacing.Start
    );

    for (let i = 0; i < children.length; i++) children[i].setOffset($x + xOffset, $y + yOffsets[i]);
  });

  return children;
}, defineComponentExports<WithBB>());

export { VerticalLayout, VerticalLayoutConfig };
