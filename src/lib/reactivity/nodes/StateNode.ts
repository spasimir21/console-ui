import { SubscribableNode } from './base/SubscribableNode';
import { EqualityCheck, areIdentical } from '../equal';
import { ReactiveEvent } from '../reactiveEvent';
import { makeReactive } from '../makeReactive';
import { TrackStack } from '../TrackStack';
import { getRaw } from '../raw';

interface StateOptions {
  equalityCheck?: EqualityCheck;
  reactiveDepth?: number;
}

class StateNode<T> extends SubscribableNode {
  public readonly options: Required<StateOptions>;

  protected _value: T;

  get value() {
    this.track();
    return this._value;
  }

  set value(newValue: T) {
    TrackStack.pushTrackPause();
    const areEqual = this.options.equalityCheck(getRaw(this._value), getRaw(newValue));

    this._value = makeReactive(newValue, this.options.reactiveDepth, this.options.equalityCheck);
    TrackStack.pop();

    if (areEqual) return;

    this.broadcastEvent(ReactiveEvent.Changed);
  }

  constructor(initialValue: T, options?: StateOptions) {
    super();

    this.options = {
      equalityCheck: options?.equalityCheck ?? areIdentical,
      reactiveDepth: options?.reactiveDepth ?? Infinity
    };

    TrackStack.pushTrackPause();
    this._value = makeReactive(initialValue, this.options.reactiveDepth, this.options.equalityCheck);
    TrackStack.pop();
  }
}

export { StateNode, StateOptions };
