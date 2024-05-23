import { Component, defineComponentExports } from '../component/Component';
import { useKeypressHandler } from '../hooks/useKeypressHandler';
import { WritableNode, writableNode } from '../../reactivity';
import { useExport } from '../hooks/useExport';
import { useState } from '../hooks/useState';

const FocusManager = Component((names: string[], nextKey: string, prevKey: string) => {
  const focusedIndex = useState(0);

  useKeypressHandler(press => {
    if (press.name === nextKey) $focusedIndex++;
    else if (press.name === prevKey) $focusedIndex--;
    else return;

    $focusedIndex %= names.length;
    if ($focusedIndex < 0) $focusedIndex = names.length - 1;
  });

  const focused = writableNode(
    () => names[$focusedIndex],
    name => ($focusedIndex = names.indexOf(name))
  );

  useExport('focused', () => focused);
}, defineComponentExports<{ focused: WritableNode<string> }>());

export { FocusManager };
