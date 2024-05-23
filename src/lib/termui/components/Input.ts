import { Component, defineComponentExports } from '../component/Component';
import { useMousepressHandler } from '../hooks/useMousepressHandler';
import { Value, WritableNode, readableNode } from '../../reactivity';
import { useKeypressHandler } from '../hooks/useKeypressHandler';
import { Alignment, fixAlignment } from '../alignAndSpace';
import { useComputed } from '../hooks/useComputed';
import { BBConfig, WithBB, useBB } from '../hooks/useBB';
import { useEffect } from '../hooks/useEffect';
import { useValue } from '../hooks/useValue';
import { useState } from '../hooks/useState';
import { Box, BoxDesign } from './Box';
import { Terminal } from '../Terminal';
import { Chalk } from 'chalk';
import { Text } from './Text';

interface InputConfig extends BBConfig {
  width: number;
  padding: [number, number];
  placeholder: string;
  boxDesign: BoxDesign;
  focusedBoxDesign?: BoxDesign;
  boxStyle?: Chalk;
  focusedBoxStyle?: Chalk;
  textStyle?: Chalk;
  placeholderStyle?: Chalk;
}

const Input = Component(
  (
    name: string,
    focused: WritableNode<string>,
    value: WritableNode<string>,
    configValue: Value<InputConfig>
  ): Component[] => {
    const config = useValue(configValue);

    const { x, y, width, height } = useBB(
      config,
      () => $config.width,
      () => $config.padding[1] * 2 + 3
    );

    const cursorOffset = useState(0);
    const textOffset = useState(0);

    const textWidth = useComputed(() => $width - $config.padding[0] * 2 - 2);

    useKeypressHandler(press => {
      if ($focused !== name) return;

      if (press.name === 'left') {
        $cursorOffset--;
        return;
      } else if (press.name === 'right') {
        $cursorOffset++;
        return;
      }

      $value += press.name;
      $cursorOffset += press.name.length;
    });

    useMousepressHandler(press => {
      if (press.x < $x || press.x > $x + $width || press.y < $y || press.y > $y + $height) return;

      $focused = name;
    });

    useEffect(() => {
      if ($focused !== name) return;

      Terminal.setCursorPosition($x + 1 + $config.padding[0] + $cursorOffset, $y + 1 + $config.padding[1]);
    });

    return [
      // Text(
      //   readableNode(() => {
      //     const text = $value.length === 0 ? $config.placeholder : $value;
      //     return text.slice($textOffset, $textOffset + $textWidth);
      //   }),
      //   () => ({
      //     x: $x + 1 + $config.padding[0],
      //     y: $y + 1 + $config.padding[1],
      //     style: $value.length === 0 ? $config.placeholderStyle : $config.textStyle
      //   })
      // ),
      Box(() => ({
        x: $x,
        y: $y,
        width: $width,
        height: $height,
        design: ($focused === name ? $config.focusedBoxDesign : $config.boxDesign) ?? $config.boxDesign,
        style: ($focused === name ? $config.focusedBoxStyle : $config.boxStyle) ?? $config.boxStyle
      }))
    ];
  },
  defineComponentExports<WithBB>()
);

export { Input, InputConfig };
