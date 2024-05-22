import * as tsNode from 'ts-node';
import resolve from 'resolve';

const isTsNodeRegistered = () => Symbol.for('ts-node.register.instance') in process;

function guaranteeTsNode() {
  if (isTsNodeRegistered()) return;

  // TODO: Find a better way to infer these settings that works for more environments
  tsNode.register({
    transpileOnly: true,
    skipProject: true,
    experimentalResolver: true,
    compilerOptions: {
      target: 'ES2018',
      jsx: 'react',
      esModuleInterop: true,
      module: 'commonjs'
    }
  });
}

function tsRequire<T = any>(path: string, basedir: string) {
  guaranteeTsNode();
  return require(resolve.sync(path, { basedir })) as T;
}

export { tsRequire };
