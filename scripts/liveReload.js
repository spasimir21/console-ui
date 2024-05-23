const child_process = require('child_process');
const chokidar = require('chokidar');

const MAIN_FILE = './dist/index.js';
const WATCH_DIR = './dist';
const DEBOUNCE = 500;

const watcher = chokidar.watch(WATCH_DIR, { persistent: true, usePolling: true });

let lastChild = null;
let lastRun = 0;

function run() {
  const delta = Date.now() - lastRun;
  if (delta < DEBOUNCE) return;

  if (lastChild != null) lastChild.kill('SIGINT');

  const child = child_process.spawn('node', [MAIN_FILE], {
    stdio: 'inherit'
  });

  child.on('exit', () => {
    if (child !== lastChild) return;
    process.exit();
  });

  lastRun = Date.now();
  lastChild = child;
}

watcher.on('add', run);
watcher.on('addDir', run);
watcher.on('change', run);
