import { createMetadata } from './metadata';
import { TS } from './tsModuleStack';

const diagnosticsM = createMetadata<Map<number, TS.Diagnostic>>('DIAGNOSTICS');

const addDiagnosticsToSourceFile = (file: TS.SourceFile, newDiagnostics: TS.Diagnostic[]) => {
  const diagnostics = diagnosticsM.get(file) ?? new Map<number, TS.Diagnostic>();
  for (const diagnostic of newDiagnostics) diagnostics.set(diagnostic.start ?? -1, diagnostic);
  diagnosticsM.set(file, diagnostics);
};

const getDiagnosticsForSourceFile = (file: TS.SourceFile) => {
  const diagnostics = diagnosticsM.get(file);
  if (diagnostics == null) return [];
  return Array.from(diagnostics.values());
};

export { addDiagnosticsToSourceFile, getDiagnosticsForSourceFile };
