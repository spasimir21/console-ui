import { LayerRenderer, createLayerRenderer } from './LayerRenderer';
import { IndexedSet } from '../utils/IndexedSet';
import { Style, createStyleSet } from './style';
import { Terminal } from '../Terminal';

interface TerminalScreen {
  readonly size: number;
  readonly width: number;
  readonly height: number;
  readonly depthBuffer: Uint16Array;
  readonly styleBuffer: Uint16Array;
  readonly layers: LayerRenderer[];
  readonly styles: IndexedSet<Style>;
  createLayer(): LayerRenderer;
  removeLayer(zIndex: number): void;
  update(x: number, y: number, length: number, zIndex: number): void;
  beginBatch(): void;
  endBatch(): void;
}

function createTerminalScreen() {
  let batchedOutput = '';
  let batchDepth = 0;

  const screen: TerminalScreen = {
    size: process.stdout.columns * process.stdout.rows,
    width: process.stdout.columns,
    height: process.stdout.rows,
    depthBuffer: new Uint16Array(process.stdout.columns * process.stdout.rows),
    styleBuffer: new Uint16Array(process.stdout.columns * process.stdout.rows),
    layers: [],
    styles: createStyleSet(),
    createLayer() {
      const layer = createLayerRenderer(this, this.layers.length);
      this.layers.push(layer);
      return layer;
    },
    removeLayer(zIndex) {
      this.layers[zIndex].buffer.fill('\x00');
      screen.update(0, 0, this.size, zIndex);

      this.layers.splice(zIndex, 1);
      for (let i = zIndex; i < this.layers.length; i++) this.layers[i].zIndex--;

      for (let i = 0; i < this.depthBuffer.length; i++) {
        if (this.depthBuffer[i] < zIndex) continue;
        this.depthBuffer[i]--;
      }
    },
    update(x, y, length, updatedZIndex) {
      let pos = y * this.width + x;

      let prevStyleIndex = 0;
      let output = '';

      for (let i = 0; i < length; i++) {
        let zIndex = updatedZIndex;

        if (this.depthBuffer[pos] > updatedZIndex) zIndex = this.depthBuffer[pos];
        else if (this.layers[zIndex].buffer[pos] === '\x00') {
          zIndex = this.depthBuffer[pos];
          while (this.layers[zIndex].buffer[pos] === '\x00') zIndex--;
        }

        const styleIndex = this.layers[zIndex].styleBuffer[pos];

        if (styleIndex !== prevStyleIndex) {
          output += this.styles.get(prevStyleIndex)!.close;
          output += this.styles.get(styleIndex)!.open;
        }

        output += this.layers[zIndex].buffer[pos];
        this.depthBuffer[pos] = zIndex;
        this.styleBuffer[pos] = styleIndex;
        prevStyleIndex = styleIndex;
        pos++;
      }

      output += this.styles.get(prevStyleIndex)!.close;
      output = `\u001b[${Math.floor(y) + 1};${Math.floor(x) + 1}H${output}`;

      if (batchDepth === 0) process.stdout.write(output + `\u001b[${Terminal.cursorY + 1};${Terminal.cursorX + 1}H`);
      else batchedOutput += output;
    },
    beginBatch() {
      batchDepth++;
    },
    endBatch() {
      batchDepth = Math.max(batchDepth - 1, 0);
      if (batchDepth !== 0) return;

      process.stdout.write(batchedOutput + `\u001b[${Terminal.cursorY + 1};${Terminal.cursorX + 1}H`);
      batchedOutput = '';
    }
  };

  const baseLayer = screen.createLayer();
  baseLayer.buffer.fill(' ');
  screen.update(0, 0, screen.width * screen.height, 0);

  return screen;
}

export { TerminalScreen, createTerminalScreen };
