import { Component, defineComponentExports } from '../component/Component';
import { useExport } from '../hooks/useExport';
import { useScreen } from '../hooks/useScreen';
import { Terminal } from '../Terminal';

const CursorManager = Component(() => {
  const screen = useScreen();

  const namesUsing = new Set<string>();

  const toggleCursor = (name: string, visible: boolean) => {
    if (visible) namesUsing.add(name);
    else namesUsing.delete(name);

    if ($screen == null) return;
    Terminal.toggleCursor(namesUsing.size > 0);
  };

  useExport('toggleCursor', () => toggleCursor);
}, defineComponentExports<{ toggleCursor: (name: string, visible: boolean) => void }>());

type CursorManager = ReturnType<typeof CursorManager>;

export { CursorManager };
