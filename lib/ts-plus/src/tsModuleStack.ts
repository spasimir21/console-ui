import type {} from 'ts-expose-internals';
import { Stack } from './utils/Stack';

type ts = typeof import('typescript/lib/tsserverlibrary');

const TS_MODULE_STACK = new Stack<ts>();

let ts: ts = null as any;
try {
  ts = require('typescript');
} catch {}

function pushTsModule(tsModule: ts) {
  TS_MODULE_STACK.push(tsModule);
  ts = tsModule;
  return ts;
}

function popTsModule() {
  TS_MODULE_STACK.pop();
  ts = TS_MODULE_STACK.peek();
  return ts;
}

function createCallbackWithTsModule<T extends (...args: any[]) => any>(callback: T) {
  if (TS_MODULE_STACK.peek() == null) return callback;

  const pastTsModule = ts;

  return ((...args: any[]) => {
    pushTsModule(pastTsModule);
    const result = callback(...args);
    popTsModule();
    return result;
  }) as T;
}

export type { default as TS } from 'typescript/lib/tsserverlibrary';
export { ts, pushTsModule, popTsModule, createCallbackWithTsModule };
export default ts;
