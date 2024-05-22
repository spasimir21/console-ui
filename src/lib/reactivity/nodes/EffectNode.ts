import { ReactiveEvent, reactiveEventToNodeState } from '../reactiveEvent';
import { Scheduler, instantTimeoutScheduler } from '../scheduler';
import { ReactiveNodeState } from './base/ReactiveNode';
import { SubscriberNode } from './base/SubscriberNode';
import { TrackStack } from '../TrackStack';
import { Cleanup } from '../cleanup';

type EffectCleanupCallback = (isFinal: boolean) => void;
type EffectCallback = () => EffectCleanupCallback | null | void;

interface EffectOptions {
  autorun?: boolean;
  scheduler?: Scheduler<any>;
}

class EffectNode extends SubscriberNode {
  public readonly options: Required<EffectOptions>;

  protected cleanupCallback: EffectCleanupCallback | null = null;
  protected lastScheduledId: any = null;

  constructor(public readonly effectCallback: EffectCallback, options?: EffectOptions) {
    super();

    this.options = {
      autorun: options?.autorun ?? true,
      scheduler: options?.scheduler ?? instantTimeoutScheduler
    };

    this.validate = this.validate.bind(this);

    if (this.options.autorun) this.execute();
  }

  onEventRecieved(event: ReactiveEvent) {
    const newState = reactiveEventToNodeState(event);
    if (newState <= this.state) return;

    this.state = newState;
    if (this.lastScheduledId == null) this.lastScheduledId = this.options.scheduler.schedule(this.validate);
  }

  execute() {
    TrackStack.pushTrackPause();
    if (this.cleanupCallback) this.cleanupCallback(false);
    TrackStack.pop();

    TrackStack.push();
    this.cleanupCallback = this.effectCallback() ?? null;
    this.updateSubscriptions(TrackStack.pop()!);

    this.state = ReactiveNodeState.Normal;
  }

  validate() {
    if (this.state === ReactiveNodeState.Invalidated) this.validateSubscriptions();

    if (this.state === ReactiveNodeState.Dirty) {
      this.execute();
      this.lastScheduledId = null;

      return;
    }

    this.state = ReactiveNodeState.Normal;
    this.lastScheduledId = null;
  }

  [Cleanup.symbol]() {
    this.unsubscribeFromAll();

    if (this.lastScheduledId != null) this.options.scheduler.cancel(this.lastScheduledId);
    this.lastScheduledId = null;

    TrackStack.pushTrackPause();
    if (this.cleanupCallback) this.cleanupCallback(true);
    this.cleanupCallback = null;
    TrackStack.pop();
  }
}

export { EffectNode, EffectCallback, EffectCleanupCallback, EffectOptions };
