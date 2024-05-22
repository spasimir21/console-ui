import { QuickInfoPatch } from 'ts-plus';

const createReactiveQuickInfoPatch =
  (name: string, type: string): QuickInfoPatch =>
  info =>
    info == null
      ? null
      : {
          ...info,
          displayParts: [
            {
              kind: 'text',
              text: `(reactive) ${name}: ${type}`
            }
          ]
        };

export { createReactiveQuickInfoPatch };
