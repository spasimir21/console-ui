import { Terminal, createTerminalScreen } from './lib/termui';
import { App } from './App';

process.title = 'TermUI Account Manager';

Terminal.clear();
Terminal.hideCursor();

Terminal.enableKeyboardInput();
Terminal.enableMouseInput();

const screen = createTerminalScreen(process.stdout, process.stdout.columns, process.stdout.rows);

const app = App();
app.mount(screen);

process.stdout.on('resize', () => {
  Terminal.clear();

  if (!Terminal.isCursorVisible) Terminal.hideCursor();
  Terminal.enableMouseInput();

  screen.resize(process.stdout.columns, process.stdout.rows);
});

process.on('exit', () => {
  app.cleanup();

  Terminal.disableMouseInput();

  Terminal.clear();
  Terminal.showCursor();

  console.log(screen.layers.length);
});
