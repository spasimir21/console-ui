import { NodeGenerator, TS, fixFactoryNode } from 'ts-plus';

// => NAME.value
const generateReactiveTypeNode: NodeGenerator<TS.PropertyAccessExpression, [name: string, flowNode?: TS.FlowNode]> = (
  f,
  realNode,
  name,
  flowNode
) => {
  const node = fixFactoryNode(
    realNode,
    f.createPropertyAccessExpression(f.createIdentifier(name), f.createIdentifier('value'))
  );

  // @ts-ignore
  node.expression.flowNode = flowNode;

  return node;
};

export { generateReactiveTypeNode };
