import fs from 'fs';

const FILE = './log.txt';

fs.writeFileSync(FILE, '');

const log = (message: string) => fs.appendFileSync(FILE, message + '\n');

export { log };
