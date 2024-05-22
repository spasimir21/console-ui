import { ts, TS, traverseAST, initNodeIn, setQuickInfoOfNode, addTypePatch, TypePatcherFactory } from 'ts-plus';
import { generateReactiveTypeNode } from './generators/reactiveTypeNode';
import { generateSymbolNode } from './generators/symbolNode';
import { createReactiveQuickInfoPatch } from './quickInfo';
import { reactiveSymbolM } from './metadata';

const getValueType = (type: TS.Type, node: TS.Node, typeChecker: TS.TypeChecker): TS.Type | null => {
  const valueSymbol = type.getProperty('value');
  if (valueSymbol != null) return typeChecker.getTypeOfSymbolAtLocation(valueSymbol, node);

  if (!type.isUnion()) return null;

  return type.types.map(t => getValueType(t, node, typeChecker)).find(t => t != null) ?? null;
};

const hydrateSyntheticSymbol = (synthSymbol: TS.Symbol, flags: TS.SymbolFlags, type: TS.Type) => {
  // @ts-ignore
  synthSymbol.links.type = type;

  synthSymbol.flags = ts.SymbolFlags.Transient | flags;
};

const tryPatchReactiveIdentifier = (node: TS.Identifier, typeChecker: TS.TypeChecker) => {
  if (!node.text.startsWith('$')) return;

  const injectedSymbol = typeChecker.getSymbolAtLocation(node);
  if (injectedSymbol == null) return;

  const originalSymbol = reactiveSymbolM.get(injectedSymbol);
  if (originalSymbol == null) return;

  // @ts-ignore
  const valueNode = generateReactiveTypeNode(ts.factory, node, originalSymbol.name, node.flowNode);
  initNodeIn(valueNode, node, node.parent, typeChecker);

  const symbolNode = generateSymbolNode(ts.factory, node, node.text);
  initNodeIn(symbolNode, node, node.parent, typeChecker);

  const newSymbol = typeChecker.getSymbolAtLocation(symbolNode);
  if (newSymbol == null) return;

  const type = typeChecker.getTypeAtLocation(valueNode);

  hydrateSyntheticSymbol(newSymbol, injectedSymbol.flags, type);

  setQuickInfoOfNode(node, createReactiveQuickInfoPatch(originalSymbol.name, typeChecker.typeToString(type)));

  // @ts-ignore
  return symbolNode.id;
};

const injectIntoTheScopeOf = (injectedSymbol: TS.Symbol, originalSymbol: TS.Symbol, node: TS.Node) => {
  if ('locals' in node && node.locals instanceof Map && node.locals.has(originalSymbol.name)) {
    node.locals.set(injectedSymbol.name, injectedSymbol);
    return;
  }

  if (node.parent == null) return;

  injectIntoTheScopeOf(injectedSymbol, originalSymbol, node.parent);
};

const tryPatchReactiveDefinition = (node: TS.Identifier, typeChecker: TS.TypeChecker) => {
  const originalSymbol = typeChecker.getSymbolAtLocation(node);
  if (originalSymbol == null) return;

  const name = originalSymbol.name;

  const originalType = typeChecker.getTypeOfSymbol(originalSymbol);

  const valueType = getValueType(originalType, node, typeChecker);
  if (valueType == null) return;

  const symbolNode = generateSymbolNode(ts.factory, node, '$' + name);
  initNodeIn(symbolNode, node, node.parent, typeChecker);

  const injectedSymbol = typeChecker.getSymbolAtLocation(symbolNode);
  if (injectedSymbol == null) return;

  hydrateSyntheticSymbol(injectedSymbol, ts.SymbolFlags.FunctionScopedVariable, valueType);

  reactiveSymbolM.set(injectedSymbol, originalSymbol);

  injectIntoTheScopeOf(injectedSymbol, originalSymbol, node);
};

const typePatcherFactory: TypePatcherFactory = () => (getProgram, _host, sourceFile) => {
  const typeChecker = getProgram().getTypeChecker();

  const visitor = (node: TS.Node) => {
    if (!ts.isIdentifier(node)) return node;

    if (
      node.parent != null &&
      (ts.isParameter(node.parent) ||
        ts.isBindingElement(node.parent) ||
        ts.isVariableDeclaration(node.parent) ||
        ts.isImportClause(node.parent) ||
        ts.isImportSpecifier(node.parent))
    ) {
      tryPatchReactiveDefinition(node, typeChecker);
      return node;
    }

    addTypePatch(node, getProgram, tryPatchReactiveIdentifier);
    return node;
  };

  traverseAST(sourceFile, visitor);
};

export { typePatcherFactory };
