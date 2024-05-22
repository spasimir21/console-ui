import { ReactiveEvent } from '../../reactiveEvent';
import { SubscriberNode } from './SubscriberNode';
import { ReactiveNode } from './ReactiveNode';
import { TrackStack } from '../../TrackStack';
import { Cleanup } from '../../cleanup';

class SubscribableNode extends ReactiveNode {
  protected readonly subscribers = new Set<SubscriberNode>();

  track() {
    TrackStack.track(this);
  }

  subscribe(subscriber: SubscriberNode, skipAcknowledge: boolean = false) {
    if (!skipAcknowledge && this.subscribers.has(subscriber)) return;
    this.subscribers.add(subscriber);
    if (!skipAcknowledge) subscriber.subscribeTo(this, true);
  }

  unsubscribe(subscriber: SubscriberNode, skipAcknowledge: boolean = false) {
    if (!skipAcknowledge && !this.subscribers.has(subscriber)) return;
    this.subscribers.delete(subscriber);
    if (!skipAcknowledge) subscriber.unsubscribeFrom(this, true);
  }

  broadcastEvent(event: ReactiveEvent) {
    for (const subscriber of this.subscribers) subscriber.onEventRecieved(event);
  }

  unsubscribeAll() {
    for (const subscriber of this.subscribers) this.unsubscribe(subscriber);
  }

  [Cleanup.symbol]() {
    this.unsubscribeAll();
  }
}

export { SubscribableNode };
