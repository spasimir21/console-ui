import { RESET_STYLE, createStyle } from '../rendering/style';
import { Value, getValue } from '../../reactivity';
import { Component } from '../component/Component';
import { useEffect } from '../hooks/useEffect';
import { useLayer } from '../hooks/useLayer';
import { Chalk } from 'chalk';

interface TextConfig {
  x: number;
  y: number;
  text: string;
  style?: Chalk;
  clear?: boolean;
}

const Text = Component((configValue: Value<TextConfig>) =>
  useLayer(layer => {
    let prevConfig = getValue(configValue);

    useEffect(() => {
      const config = getValue(configValue);

      const style = config.style ? createStyle(config.style) : RESET_STYLE;

      layer.screen.beginBatch();
      if (config.clear !== false) layer.write(prevConfig.x, prevConfig.y, '\x00'.repeat(prevConfig.text.length));
      layer.write(config.x, config.y, config.text, style);
      layer.screen.endBatch();

      prevConfig = { ...config };
    });
  })
);

export { Text };
