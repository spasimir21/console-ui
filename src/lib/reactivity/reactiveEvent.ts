import { ReactiveNodeState } from './nodes/base/ReactiveNode';

enum ReactiveEvent {
  Invalidated,
  Changed
}

const reactiveEventToNodeState = (event: ReactiveEvent) => (event + 1) as ReactiveNodeState;

export { ReactiveEvent, reactiveEventToNodeState };
