import { reactiveSymbolM } from './metadata';
import { TS, ts } from 'ts-plus';

function transformSourceFile(
  sourceFile: TS.SourceFile,
  context: TS.TransformationContext,
  f: TS.NodeFactory,
  typeChecker: TS.TypeChecker
) {
  const visitEachChild = (node: TS.Node) => ts.visitEachChild(node, visitor, context);

  const visitor = (node: TS.Node): TS.Node => {
    if (!ts.isIdentifier(node)) return visitEachChild(node);

    const symbol = typeChecker.getSymbolAtLocation(node);
    if (symbol == null) return node;

    const reactiveSymbol = reactiveSymbolM.get(symbol);
    if (reactiveSymbol == null) return node;

    return f.createPropertyAccessExpression(f.createIdentifier(node.text.slice(1)), 'value');
  };

  return visitEachChild(sourceFile) as TS.SourceFile;
}

function transformerFactory(program: TS.Program): TS.TransformerFactory<TS.SourceFile> {
  const typeChecker = program.getTypeChecker();

  return context => sourceFile => transformSourceFile(sourceFile, context, context.factory, typeChecker);
}

export { transformerFactory };
