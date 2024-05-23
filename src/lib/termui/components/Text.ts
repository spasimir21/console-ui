import { Component, defineComponentExports } from '../component/Component';
import { BBConfig, WithBB, useBB } from '../hooks/useBB';
import { useComputed } from '../hooks/useComputed';
import { createStyle } from '../rendering/style';
import { useEffect } from '../hooks/useEffect';
import { useLayer } from '../hooks/useLayer';
import { useValue } from '../hooks/useValue';
import { Value } from '../../reactivity';
import { Chalk } from 'chalk';

interface TextConfig extends BBConfig {
  style?: Chalk;
  clear?: boolean;
}

const Text = Component((textValue: Value<string>, configValue: Value<TextConfig>) => {
  const config = useValue(configValue);
  const text = useValue(textValue);

  const style = useComputed(() => ($config.style ? createStyle($config.style!) : undefined));

  const { x, y, width } = useBB(
    config,
    () => $text.length,
    () => 1
  );

  useLayer(layer => {
    let prevLength = 0;
    let prevX = 0;
    let prevY = 0;

    useEffect(() => {
      if ($x < 0 || $y < 0) return;

      layer.screen.beginBatch();
      if ($config.clear !== false) layer.write(prevX, prevY, '\x00'.repeat(prevLength));
      layer.write($x, $y, $text, $style);
      layer.screen.endBatch();

      prevLength = $width;
      prevX = $x;
      prevY = $y;
    });
  });
}, defineComponentExports<WithBB>());

export { Text, TextConfig };
