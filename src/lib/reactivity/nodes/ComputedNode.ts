import { ReactiveEvent, reactiveEventToNodeState } from '../reactiveEvent';
import { ReactiveNodeState } from './base/ReactiveNode';
import { EqualityCheck, areIdentical } from '../equal';
import { makeReactive } from '../makeReactive';
import { DuplexNode } from './base/DuplexNode';
import { TrackStack } from '../TrackStack';
import { getRaw } from '../raw';

interface ComputedOptions {
  equalityCheck?: EqualityCheck;
  reactiveDepth?: number;
}

class ComputedNode<T> extends DuplexNode {
  public readonly options: Required<ComputedOptions>;

  protected _value: T = null as any;

  get value() {
    if (this.state !== ReactiveNodeState.Normal) this.validate();
    this.track();
    return this._value;
  }

  constructor(public readonly getter: () => T, options?: ComputedOptions) {
    super();

    this.options = {
      equalityCheck: options?.equalityCheck ?? areIdentical,
      reactiveDepth: options?.reactiveDepth ?? Infinity
    };

    this.validate = this.validate.bind(this);

    this.state = ReactiveNodeState.Dirty;
  }

  onEventRecieved(event: ReactiveEvent) {
    const newState = reactiveEventToNodeState(event);
    if (newState <= this.state) return;

    this.state = newState;

    this.broadcastEvent(ReactiveEvent.Invalidated);
  }

  validate() {
    if (this.state === ReactiveNodeState.Invalidated) this.validateSubscriptions();

    if (this.state === ReactiveNodeState.Dirty) {
      this.update();
      return;
    }

    this.state = ReactiveNodeState.Normal;
  }

  update() {
    TrackStack.push();
    const newValue = this.getter();
    this.updateSubscriptions(TrackStack.pop()!);

    TrackStack.pushTrackPause();
    const didChange = !this.options.equalityCheck(getRaw(this._value), getRaw(newValue));

    this._value = makeReactive(newValue, this.options.reactiveDepth, this.options.equalityCheck);
    TrackStack.pop();

    this.state = ReactiveNodeState.Normal;

    if (!didChange) return;

    this.broadcastEvent(ReactiveEvent.Changed);
  }
}

export { ComputedNode, ComputedOptions };
