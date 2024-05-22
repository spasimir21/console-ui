import { LanguageServicePatch } from '../languageServicePatch';
import { getDiagnosticsForSourceFile } from 'ts-plus';

const getSemanticDiagnosticsPatch: LanguageServicePatch<'getSemanticDiagnostics'> = (ts, { languageService }, log) => {
  return filename => {
    const diagnostics = languageService.getSemanticDiagnostics(filename);

    const program = languageService.getProgram();
    if (program == null) return diagnostics;

    const sourceFile = program.getSourceFile(filename);
    if (sourceFile == null) return diagnostics;

    const newDiagnostics = getDiagnosticsForSourceFile(sourceFile);

    return newDiagnostics.length == 0 ? diagnostics : [...diagnostics, ...newDiagnostics];
  };
};

export { getSemanticDiagnosticsPatch };
