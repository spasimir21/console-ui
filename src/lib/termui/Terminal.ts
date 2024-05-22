// @ts-ignore
import keypress from 'keypress';

const Terminal = {
  isCursorVisible: true,
  cursorX: 0,
  cursorY: 0,
  clear() {
    process.stdout.write('\x1Bc');
  },
  toggleCursor(visible: boolean) {
    process.stdout.write(visible ? '\u001B[?25h' : '\u001B[?25l');
    this.isCursorVisible = visible;
  },
  showCursor() {
    this.toggleCursor(true);
  },
  hideCursor() {
    this.toggleCursor(false);
  },
  enableKeyboardInput(allowSIGINT = true) {
    keypress(process.stdin);

    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    if (allowSIGINT)
      process.stdin.on('keypress', (_, key) => {
        if (key && key.ctrl && key.name == 'c') process.exit();
      });
  },
  enableMouseInput() {
    keypress.enableMouse(process.stdout);
  },
  disableMouseInput() {
    keypress.disableMouse(process.stdout);
  },
  setCursor(x: number, y: number) {
    this.cursorX = Math.round(x);
    this.cursorY = Math.round(y);
    process.stdout.write(`\u001b[${this.cursorY};${this.cursorX}H$`);
  }
};

export { Terminal };
