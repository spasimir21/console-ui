import type TS from 'typescript/lib/tsserverlibrary';

function getNodeAtPosition(
  ts: typeof TS,
  sourceFile: TS.SourceFile,
  position: number,
  endLeeway: number = 0
): TS.Node | null {
  function visit(node: TS.Node): TS.Node | null {
    if (node.getStart(sourceFile) <= position && node.getEnd() >= position - endLeeway)
      return ts.forEachChild(node, visit) ?? node;
    return null;
  }

  return visit(sourceFile);
}

export { getNodeAtPosition };
