import { Component, defineComponentExports } from '../component/Component';
import { Value, WritableNode, readableNode } from '../../reactivity';
import { useKeypressHandler } from '../hooks/useKeypressHandler';
import { useClickToFocus } from '../hooks/useClickToFocus';
import { BBConfig, WithBB, useBB } from '../hooks/useBB';
import { isPrintableASCII } from '../utils/isASCII';
import { CursorManager } from './CursorManager';
import { useEffect } from '../hooks/useEffect';
import { useValue } from '../hooks/useValue';
import { useState } from '../hooks/useState';
import { Box, BoxDesign } from './Box';
import { Terminal } from '../Terminal';
import { Chalk } from 'chalk';
import { Text } from './Text';
import { useComputed } from '../hooks/useComputed';

const isSpecialKey = (sequence: string) => sequence.length > 1 || !isPrintableASCII(sequence);

interface InputConfig extends BBConfig {
  width: number;
  charMask?: string;
  padX?: number;
  padY?: number;
  placeholder?: string;
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
    cursorManager: CursorManager,
    value: WritableNode<string>,
    configValue: Value<InputConfig>
  ): Component[] => {
    const config = useValue(configValue);

    const { x, y, width, height } = useBB(
      config,
      () => $config.width,
      () => ($config.padY ?? 0) * 2 + 3
    );

    const cursorOffset = useState(0);
    const xScroll = useState(0);

    const usableWidth = useComputed(() => $width - ($config.padX ?? 0) * 2 - 2);
    const isFocused = useComputed((): boolean => $focused === name);

    const moveCursorForward = () => {
      if ($cursorOffset < $usableWidth && $cursorOffset < $value.length - $xScroll) $cursorOffset++;
      else if ($value.length - $xScroll > $usableWidth) $xScroll++;
    };

    const moveCursorBack = () => {
      if ($cursorOffset > 0) $cursorOffset--;
      else if ($xScroll > 0) $xScroll--;
    };

    useKeypressHandler(press => {
      if (!$isFocused) return;

      const insertionPoint = $xScroll + $cursorOffset;

      if (isSpecialKey(press.sequence)) {
        if (press.name === 'right') moveCursorForward();
        else if (press.name === 'left') moveCursorBack();
        else if (press.name === 'delete') $value = $value.slice(0, insertionPoint) + $value.slice(insertionPoint + 1);
        else if (press.name === 'backspace' && insertionPoint > 0) {
          $value = $value.slice(0, insertionPoint - 1) + $value.slice(insertionPoint);
          moveCursorBack();
        }

        return;
      }

      $value = $value.slice(0, insertionPoint) + press.sequence + $value.slice(insertionPoint);
      moveCursorForward();
    });

    useClickToFocus(name, focused, x, y, width, height, press => {
      $cursorOffset = Math.max(Math.min(press.x - $x - ($config.padX ?? 0) - 2, $usableWidth, $value.length), 0);
    });

    useEffect(() => {
      if ($isFocused)
        Terminal.setCursorPosition($x + 1 + ($config.padX ?? 0) + $cursorOffset, $y + 1 + ($config.padY ?? 0));
      else {
        $cursorOffset = 0;
        $xScroll = 0;
      }

      cursorManager.toggleCursor(name, $isFocused);
    });

    return [
      Text(
        readableNode(() => {
          if ($value.length === 0) return $config.placeholder ?? '';

          const text = $config.charMask != null ? $config.charMask!.repeat($value.length) : $value;
          return text.slice($xScroll, $xScroll + $usableWidth);
        }),
        () => ({
          x: $x + 1 + ($config.padX ?? 0),
          y: $y + 1 + ($config.padY ?? 0),
          style: $value.length === 0 ? $config.placeholderStyle : $config.textStyle
        })
      ),
      Box(() => ({
        x: $x,
        y: $y,
        width: $width,
        height: $height,
        design: ($isFocused ? $config.focusedBoxDesign : $config.boxDesign) ?? $config.boxDesign,
        style: ($isFocused ? $config.focusedBoxStyle : $config.boxStyle) ?? $config.boxStyle
      }))
    ];
  },
  defineComponentExports<WithBB>()
);

export { Input, InputConfig };
