import { LanguageServicePatch } from '../languageServicePatch';
import { getNodeAtPosition } from '../utils/nodeAtPosition';
import { getQuickInfoOfNode } from 'ts-plus';

const getQuickInfoAtPositionPatch: LanguageServicePatch<'getQuickInfoAtPosition'> = (ts, { languageService }, log) => {
  return (filename, position) => {
    const info = languageService.getQuickInfoAtPosition(filename, position);

    const program = languageService.getProgram();
    if (program == null) return info;

    const sourceFile = program.getSourceFile(filename);
    if (sourceFile == null) return info;

    const node = getNodeAtPosition(ts, sourceFile, position);
    if (node == null) return info;

    const quickInfoPatch = getQuickInfoOfNode(node);
    if (quickInfoPatch == null) return info;

    return quickInfoPatch(info) ?? undefined;
  };
};

export { getQuickInfoAtPositionPatch };
