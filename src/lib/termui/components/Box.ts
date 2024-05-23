import { Component, defineComponentExports } from '../component/Component';
import { BBConfig, WithBB, useBB } from '../hooks/useBB';
import { useComputed } from '../hooks/useComputed';
import { createStyle } from '../rendering/style';
import { useEffect } from '../hooks/useEffect';
import { useValue } from '../hooks/useValue';
import { useLayer } from '../hooks/useLayer';
import { Value } from '../../reactivity';
import { Chalk } from 'chalk';

interface BoxDesign {
  corners: [string, string, string, string];
  vertical: string;
  horizontal: string;
  fill: string;
}

interface BoxConfig extends BBConfig {
  width: number;
  height: number;
  design: BoxDesign;
  style?: Chalk;
  clear?: boolean;
}

/*
  ┏━━━━┓
  ┃    ┃
  ┗━━━━┛
*/
const SolidBoldBoxDesign: BoxDesign = {
  corners: ['┏', '┓', '┗', '┛'],
  vertical: '┃',
  horizontal: '━',
  fill: '\x00'
};

/*
  ┌────┐
  │    │
  └────┘
*/
const SolidBoxDesign: BoxDesign = {
  corners: ['┌', '┐', '└', '┘'],
  vertical: '│',
  horizontal: '─',
  fill: '\x00'
};

/*
  ██████
  ██████
  ██████
*/
const BlockBoxDesign: BoxDesign = {
  corners: ['█', '█', '█', '█'],
  vertical: '█',
  horizontal: '█',
  fill: '█'
};

/*
  
  
  
*/
const InvisibleBoxDesign: BoxDesign = {
  corners: ['\x00', '\x00', '\x00', '\x00'],
  vertical: '\x00',
  horizontal: '\x00',
  fill: '\x00'
};

const Box = Component((configValue: Value<BoxConfig>) => {
  const config = useValue(configValue);

  const style = useComputed(() => ($config.style ? createStyle($config.style!) : undefined));

  const { x, y, width, height } = useBB(
    config,
    () => $config.width,
    () => $config.height
  );

  useLayer(layer => {
    let prevWidth = 0;
    let prevHeight = 0;
    let prevX = 0;
    let prevY = 0;

    useEffect(() => {
      if ($x < 0 || $y < 0) return;

      layer.screen.beginBatch();

      if ($config.clear !== false) {
        const line = '\x00'.repeat(prevWidth);
        for (let i = 0; i < prevHeight; i++) layer.write(prevX, prevY + i, line);
      }

      const design = $config.design;

      const fillWidth = $width < 2 ? 0 : $width - 2;

      const topLine = (design.corners[0] + design.horizontal.repeat(fillWidth) + design.corners[1]).slice(0, $width);

      const middleLine = (design.vertical + design.fill.repeat(fillWidth) + design.vertical).slice(0, $width);

      const bottomLine = (design.corners[2] + design.horizontal.repeat(fillWidth) + design.corners[3]).slice(0, $width);

      for (let i = 0; i < $height; i++) {
        // prettier-ignore
        const line =
            i === 0 ? topLine
          : i === $height - 1 ? bottomLine
          : middleLine;

        layer.write($x, $y + i, line, $style);
      }

      layer.screen.endBatch();

      prevWidth = $width;
      prevHeight = $height;
      prevX = $x;
      prevY = $y;
    });
  });
}, defineComponentExports<WithBB>());

export { Box, BoxConfig, BoxDesign, SolidBoldBoxDesign, SolidBoxDesign, BlockBoxDesign, InvisibleBoxDesign };
