import { Component, defineComponentExports } from '../component/Component';
import { useKeypressHandler } from '../hooks/useKeypressHandler';
import { useClickToFocus } from '../hooks/useClickToFocus';
import { BBConfig, WithBB, useBB } from '../hooks/useBB';
import { Value, WritableNode } from '../../reactivity';
import { useValue } from '../hooks/useValue';
import { Box, BoxDesign } from './Box';
import { Chalk } from 'chalk';
import { Text } from './Text';
import { useComputed } from '../hooks/useComputed';

interface ButtonConfig extends BBConfig {
  padX?: number;
  padY?: number;
  boxDesign: BoxDesign;
  focusedBoxDesign?: BoxDesign;
  boxStyle?: Chalk;
  focusedBoxStyle?: Chalk;
  textStyle?: Chalk;
  focusedTextStyle?: Chalk;
}

const Button = Component(
  (
    name: string,
    focused: WritableNode<string>,
    textValue: Value<string>,
    callback: () => void,
    configValue: Value<ButtonConfig>
  ): Component[] => {
    const config = useValue(configValue);
    const text = useValue(textValue);

    const { x, y, width, height } = useBB(
      config,
      () => $text.length + ($config.padX ?? 0) * 2,
      () => ($config.padY ?? 0) * 2 + 1
    );

    const isFocused = useComputed(() => $focused === name);

    useClickToFocus(name, focused, x, y, width, height, callback);

    useKeypressHandler(press => {
      if (!$isFocused || press.name !== 'return') return;
      callback();
    });

    return [
      Box(() => ({
        x: $x,
        y: $y,
        width: $width,
        height: $height,
        design: ($isFocused ? $config.focusedBoxDesign : $config.boxDesign) ?? $config.boxDesign,
        style: ($isFocused ? $config.focusedBoxStyle : $config.boxStyle) ?? $config.boxStyle
      })),
      Text(text, () => ({
        x: $x + ($config.padX ?? 0),
        y: $y + ($config.padY ?? 0),
        style: ($isFocused ? $config.focusedTextStyle : $config.textStyle) ?? $config.textStyle
      }))
    ];
  },
  defineComponentExports<WithBB>()
);

export { Button, ButtonConfig };
