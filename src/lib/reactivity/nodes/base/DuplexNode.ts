import { SubscribableNode } from './SubscribableNode';
import { SubscriberNode } from './SubscriberNode';
import { applyMixin } from '../../utils/mixin';
import { ReactiveNode } from './ReactiveNode';
import { Cleanup } from '../../cleanup';

type DuplexNode = SubscriberNode & SubscribableNode;

const DuplexNode: new () => DuplexNode = class DuplexNode extends ReactiveNode {
  protected readonly subscriptions = new Set<SubscribableNode>();
  protected readonly subscribers = new Set<SubscriberNode>();
} as any;

applyMixin(DuplexNode, SubscriberNode);
applyMixin(DuplexNode, SubscribableNode);

DuplexNode.prototype[Cleanup.symbol] = function (this: DuplexNode) {
  this.unsubscribeAll();
  this.unsubscribeFromAll();
};

export { DuplexNode };
