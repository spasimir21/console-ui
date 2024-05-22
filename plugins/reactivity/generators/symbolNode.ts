import { NodeGenerator, TS, fixFactoryNode } from 'ts-plus';

// => ({ NAME: null }).NAME
const generateSymbolNode: NodeGenerator<TS.PropertyAccessExpression, [name: string]> = (f, realNode, name) => {
  const node = fixFactoryNode(
    realNode,
    f.createPropertyAccessExpression(
      f.createObjectLiteralExpression([f.createPropertyAssignment(f.createIdentifier(name), f.createNull())], false),
      f.createIdentifier(name)
    )
  );

  // @ts-ignore
  node.expression.symbol = {
    name: '',
    escapedName: ''
  };

  // @ts-ignore
  node.expression.properties[0].symbol = {
    name: name,
    escapedName: name
  };

  return node;
};

export { generateSymbolNode };
