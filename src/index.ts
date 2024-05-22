import { Terminal, createTerminalScreen } from './lib/termui';
import { App } from './App';

Terminal.enableKeyboardInput();
Terminal.enableMouseInput();

Terminal.clear();
Terminal.hideCursor();

const screen = createTerminalScreen();

const app = App();
app.mount(screen);

process.on('exit', () => {
  app.cleanup();

  Terminal.disableMouseInput();

  Terminal.clear();
  Terminal.showCursor();
});
