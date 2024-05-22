import { markReactive } from '../../reactiveFlag';
import { cleanup } from '../../cleanup';

enum ReactiveNodeState {
  Normal,
  Invalidated,
  Dirty
}

class ReactiveNode {
  protected state: ReactiveNodeState = ReactiveNodeState.Normal;

  constructor() {
    markReactive(this);
  }

  validate() {}

  cleanup() {
    cleanup(this);
  }
}

export { ReactiveNode, ReactiveNodeState };
