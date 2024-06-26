import { LayerRenderer, createLayerRenderer } from './LayerRenderer';
import { applyDecorationsToObject } from '../../reactivity';
import { resizeUint16Array } from '../utils/resize';
import { IndexedSet } from '../utils/IndexedSet';
import { Style, createStyleSet } from './style';
import { Terminal } from '../Terminal';

interface TerminalScreen {
  readonly stream: NodeJS.WriteStream;
  readonly size: number;
  width: number;
  height: number;
  depthBuffer: Uint16Array;
  readonly layers: LayerRenderer[];
  readonly styles: IndexedSet<Style>;
  createLayer(): LayerRenderer;
  removeLayer(zIndex: number): void;
  update(x: number, y: number, length: number, zIndex: number): void;
  resize(newWidth: number, newHeight: number): void;
  beginBatch(): void;
  endBatch(): void;
}

function createTerminalScreen(stream: NodeJS.WriteStream, width: number, height: number) {
  let batchedOutput = '';
  let batchDepth = 0;

  const screen: TerminalScreen = {
    stream,
    width,
    height,
    get size() {
      return this.width * this.height;
    },
    depthBuffer: new Uint16Array(width * height),
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
      let output = `\u001b[${y + 1};${x + 1}H`;

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
        prevStyleIndex = styleIndex;
        pos++;
      }

      output += this.styles.get(prevStyleIndex)!.close;

      if (batchDepth === 0) stream.write(output + `\u001b[${Terminal.cursorY + 1};${Terminal.cursorX + 1}H`);
      else batchedOutput += output;
    },
    resize(newWidth, newHeight) {
      for (const layer of this.layers) layer.resize(newWidth, newHeight);

      this.depthBuffer = resizeUint16Array(this.depthBuffer, this.width, this.height, newWidth, newHeight);

      this.width = newWidth;
      this.height = newHeight;

      this.layers[0].buffer.fill(' ');
      screen.update(0, 0, this.width * this.height, 0);
    },
    beginBatch() {
      batchDepth++;
    },
    endBatch() {
      batchDepth = Math.max(batchDepth - 1, 0);
      if (batchDepth !== 0) return;

      stream.write(batchedOutput + `\u001b[${Terminal.cursorY + 1};${Terminal.cursorX + 1}H`);
      batchedOutput = '';
    }
  };

  applyDecorationsToObject(screen, {
    state: ['width', 'height'],
    computed: ['size']
  });

  const baseLayer = screen.createLayer();
  baseLayer.buffer.fill(' ');
  screen.update(0, 0, screen.width * screen.height, 0);

  return screen;
}

export { TerminalScreen, createTerminalScreen };
