import { Component } from '../component/Component';
import { useCleanup } from '../hooks/useCleanup';
import { useOnMount } from '../hooks/useOnMount';

const Div = Component((...children: Component[]) => {
  useOnMount(screen => {
    for (const child of children) child.mount(screen);
  });

  useCleanup(() => {
    for (const child of children) child.cleanup();
  });
});

export { Div };
