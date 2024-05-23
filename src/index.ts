import { Terminal, createTerminalScreen } from './lib/termui';
import { App } from './App';

Terminal.clear();
// Terminal.hideCursor();

Terminal.enableKeyboardInput();
Terminal.enableMouseInput();

const screen = createTerminalScreen();

const app = App();
app.mount(screen);

process.on('exit', () => {
  app.cleanup();

  Terminal.disableMouseInput();

  Terminal.clear();
  Terminal.showCursor();
});
