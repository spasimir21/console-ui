import { SubscribableNode } from './SubscribableNode';
import { ReactiveEvent } from '../../reactiveEvent';
import { ReactiveNode } from './ReactiveNode';
import { Cleanup } from '../../cleanup';

class SubscriberNode extends ReactiveNode {
  protected readonly subscriptions = new Set<SubscribableNode>();

  subscribeTo(subscription: SubscribableNode, skipAcknowledge: boolean = false) {
    if (!skipAcknowledge && this.subscriptions.has(subscription)) return;
    this.subscriptions.add(subscription);
    if (!skipAcknowledge) subscription.subscribe(this, true);
  }

  unsubscribeFrom(subscription: SubscribableNode, skipAcknowledge: boolean = false) {
    if (!skipAcknowledge && !this.subscriptions.has(subscription)) return;
    this.subscriptions.delete(subscription);
    if (!skipAcknowledge) subscription.unsubscribe(this, true);
  }

  updateSubscriptions(newSubscriptions: Set<SubscribableNode>, treatNewSubscriptionsAsImmutable: boolean = true) {
    if (treatNewSubscriptionsAsImmutable) newSubscriptions = new Set(newSubscriptions);

    for (const subscription of this.subscriptions) {
      if (!newSubscriptions.has(subscription)) this.unsubscribeFrom(subscription);
      newSubscriptions.delete(subscription);
    }

    for (const subscription of newSubscriptions) this.subscribeTo(subscription);
  }

  onEventRecieved(event: ReactiveEvent) {}

  protected validateSubscriptions() {
    for (const subscription of this.subscriptions) subscription.validate();
  }

  unsubscribeFromAll() {
    for (const subscription of this.subscriptions) this.unsubscribeFrom(subscription);
  }

  [Cleanup.symbol]() {
    this.unsubscribeFromAll();
  }
}

export { SubscriberNode };
