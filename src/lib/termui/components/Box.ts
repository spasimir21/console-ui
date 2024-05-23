import { Component } from '../component/Component';
import { useComputed } from '../hooks/useComputed';
import { createStyle } from '../rendering/style';
import { useEffect } from '../hooks/useEffect';
import { useValue } from '../hooks/useValue';
import { useLayer } from '../hooks/useLayer';
import { Value } from '../../reactivity';
import { Chalk } from 'chalk';
import { log } from '../../../log';

interface BoxDesign {
  corners: [string, string, string, string];
  vertical: string;
  horizontal: string;
  fill: string;
}

interface BoxConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  design: BoxDesign;
  style?: Chalk;
  clear?: boolean;
}

const SolidBoldBoxDesign: BoxDesign = {
  corners: ['┏', '┓', '┗', '┛'],
  vertical: '┃',
  horizontal: '━',
  fill: '\x00'
};

const SolidBoxDesign: BoxDesign = {
  corners: ['┌', '┐', '└', '┘'],
  vertical: '│',
  horizontal: '─',
  fill: '\x00'
};

const Box = Component((configValue: Value<BoxConfig>) => {
  const config = useValue(configValue);

  const style = useComputed(() => ($config.style ? createStyle($config.style!) : undefined));

  useLayer(layer => {
    let prevWidth = 0;
    let prevHeight = 0;
    let prevX = 0;
    let prevY = 0;

    useEffect(() => {
      layer.screen.beginBatch();

      if ($config.clear !== false) {
        const line = '\x00'.repeat(prevWidth);
        for (let i = 0; i < prevHeight; i++) layer.write(prevX, prevY + i, line);
      }

      const design = $config.design;

      const fillWidth = $config.width < 2 ? 0 : $config.width - 2;

      const topLine = (design.corners[0] + design.horizontal.repeat(fillWidth) + design.corners[1]).slice(
        0,
        $config.width
      );

      const middleLine = (design.vertical + design.fill.repeat(fillWidth) + design.vertical).slice(0, $config.width);

      const bottomLine = (design.corners[2] + design.horizontal.repeat(fillWidth) + design.corners[3]).slice(
        0,
        $config.width
      );

      for (let i = 0; i < $config.height; i++) {
        // prettier-ignore
        const line =
            i === 0 ? topLine
          : i === $config.height - 1 ? bottomLine
          : middleLine;

        layer.write($config.x, $config.y + i, line, $style);
      }

      layer.screen.endBatch();

      prevWidth = $config.width;
      prevHeight = $config.height;
      prevX = $config.x;
      prevY = $config.y;
    });
  });
});

export { Box, BoxConfig, BoxDesign, SolidBoldBoxDesign, SolidBoxDesign };
