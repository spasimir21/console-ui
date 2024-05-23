import { ReadableNode, Value } from '../../reactivity';
import { useComputed } from '../hooks/useComputed';
import { Component } from '../component/Component';
import { createStyle } from '../rendering/style';
import { useEffect } from '../hooks/useEffect';
import { useLayer } from '../hooks/useLayer';
import { useValue } from '../hooks/useValue';
import { Chalk } from 'chalk';

interface TextConfig {
  x: number;
  y: number;
  style?: Chalk;
  clear?: boolean;
}

const Text = Component((text: ReadableNode<string>, configValue: Value<TextConfig>) => {
  const config = useValue(configValue);

  const style = useComputed(() => ($config.style ? createStyle($config.style!) : undefined));

  useLayer(layer => {
    let prevLength = 0;
    let prevX = 0;
    let prevY = 0;

    useEffect(() => {
      layer.screen.beginBatch();
      if ($config.clear !== false) layer.write(prevX, prevY, '\x00'.repeat(prevLength));
      layer.write($config.x, $config.y, $text, $style);
      layer.screen.endBatch();

      prevLength = $text.length;
      prevX = $config.x;
      prevY = $config.y;
    });
  });
});

export { Text, TextConfig };
