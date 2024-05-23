import { TerminalScreen } from './TerminalScreen';
import { ResetStyle, Style } from './style';

interface LayerRenderer {
  readonly screen: TerminalScreen;
  readonly styleBuffer: Uint16Array;
  readonly buffer: string[];
  zIndex: number;
  write(x: number, y: number, text: string, style?: Style): void;
  remove(clear?: boolean): void;
}

function createLayerRenderer(screen: TerminalScreen, zIndex: number): LayerRenderer {
  return {
    screen,
    buffer: new Array(screen.width * screen.height).fill('\x00'),
    styleBuffer: new Uint16Array(screen.width * screen.height),
    zIndex,
    write(x, y, text, style = ResetStyle) {
      const startPos = y * screen.width + x;

      for (let i = 0; i < text.length; i++) this.buffer[startPos + i] = text.charAt(i);

      const styleIndex = screen.styles.add(style);
      this.styleBuffer.fill(styleIndex, startPos, startPos + text.length);

      screen.update(x, y, text.length, this.zIndex);
    },
    remove() {
      screen.removeLayer(this.zIndex);
    }
  };
}

export { LayerRenderer, createLayerRenderer };
