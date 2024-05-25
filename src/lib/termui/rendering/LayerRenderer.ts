import { resizeArray, resizeUint16Array } from '../utils/resize';
import { TerminalScreen } from './TerminalScreen';
import { ResetStyle, Style } from './style';

interface LayerRenderer {
  readonly screen: TerminalScreen;
  styleBuffer: Uint16Array;
  buffer: string[];
  zIndex: number;
  write(x: number, y: number, text: string, style?: Style, limit?: boolean): void;
  resize(newWidth: number, newHeight: number): void;
  remove(clear?: boolean): void;
}

function createLayerRenderer(screen: TerminalScreen, zIndex: number): LayerRenderer {
  return {
    screen,
    buffer: new Array(screen.width * screen.height).fill('\x00'),
    styleBuffer: new Uint16Array(screen.width * screen.height),
    zIndex,
    write(x, y, text, style = ResetStyle, limit = true) {
      x = Math.floor(x);
      y = Math.floor(y);

      if (x < 0 || x >= this.screen.width || y < 0 || y >= this.screen.height) return;

      if (limit) text = text.slice(0, this.screen.width - x);

      const startPos = y * screen.width + x;

      for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        if (char === '\x01') continue;
        this.buffer[startPos + i] = char;
      }

      const styleIndex = screen.styles.add(style);
      this.styleBuffer.fill(styleIndex, startPos, startPos + text.length);

      screen.update(x, y, text.length, this.zIndex);
    },
    remove() {
      screen.removeLayer(this.zIndex);
    },
    resize(newWidth: number, newHeight: number) {
      this.buffer = resizeArray(
        this.buffer,
        '',
        this.screen.width,
        this.screen.height,
        newWidth,
        newHeight
      );

      this.styleBuffer = resizeUint16Array(
        this.styleBuffer,
        this.screen.width,
        this.screen.height,
        newWidth,
        newHeight
      );
    }
  };
}

export { LayerRenderer, createLayerRenderer };
