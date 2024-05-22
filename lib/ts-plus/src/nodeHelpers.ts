import { TS, ts } from './tsModuleStack';

type NodeGenerator<TNode extends TS.Node, TArgs extends [...any[]]> = (
  f: TS.NodeFactory,
  realNode: TS.Node,
  ...args: TArgs
) => TNode;

const fixFactoryNode = <T extends TS.Node>(realNode: TS.Node, node: T, parent?: TS.Node): T => {
  if ((node.flags & ts.NodeFlags.Synthesized) != 0)
    // @ts-ignore
    node.flags = node.flags & ~ts.NodeFlags.Synthesized;
  // @ts-ignore
  if (node.pos < 0) node.pos = realNode.pos;
  // @ts-ignore
  if (node.end < 0) node.end = realNode.end;

  // @ts-ignore
  if (parent != null) node.parent = parent;

  node.forEachChild(child => void fixFactoryNode(realNode, child, node));

  return node;
};

function traverseAST(
  node: TS.Node,
  visitor: (node: TS.Node) => TS.Node | null,
  isInitialCall: boolean = true
) {
  if (isInitialCall) {
    const continuationNode = visitor(node);
    if (continuationNode == null) return;
    return traverseAST(continuationNode, visitor, false);
  }

  node.forEachChild(child => {
    const continuationNode = visitor(child);
    if (continuationNode == null) return;
    traverseAST(continuationNode, visitor, false);
  });
}

const initNodeIn = (
  node: TS.Node,
  oldNode: TS.Node,
  parent: TS.Node,
  typeChecker: TS.TypeChecker
) => {
  // @ts-ignore
  node.parent = parent;

  // @ts-ignore
  const key = Object.keys(parent).find(key => parent[key] === oldNode);

  // @ts-ignore
  if (key != null) parent[key] = node;

  const type = typeChecker.getTypeAtLocation(node);

  // @ts-ignore
  if (key != null) parent[key] = oldNode;

  return type;
};

export { fixFactoryNode, traverseAST, initNodeIn, NodeGenerator };
