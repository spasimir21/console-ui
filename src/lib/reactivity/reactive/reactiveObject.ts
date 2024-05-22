import { addDependency, removeDependency } from '../dependencies';
import { SubscribableNode } from '../nodes/base/SubscribableNode';
import { ReactiveEvent } from '../reactiveEvent';
import { makeReactive } from '../makeReactive';
import { TrackStack } from '../TrackStack';
import { keysOf } from '../utils/keysOf';
import { EqualityCheck } from '../equal';
import { getRaw, setRaw } from '../raw';

function makeObjectReactive<T extends object>(object: T, depth: number, equalityCheck: EqualityCheck): T {
  const valueNodes: Record<string, SubscribableNode> = {};
  const hasNodes: Record<string, SubscribableNode> = {};
  const keysNode = new SubscribableNode();

  addDependency(object, keysNode);

  const proxy = new Proxy(object, {
    get(target, prop, reciever) {
      const result = Reflect.get(target, prop, reciever);
      if (!TrackStack.isTracking || typeof prop !== 'string') return result;

      if (!(prop in valueNodes)) {
        valueNodes[prop] = new SubscribableNode();
        addDependency(object, valueNodes[prop]);
      }

      valueNodes[prop].track();

      return result;
    },
    set(target, prop, newValue, reciever) {
      const isPropString = typeof prop === 'string';
      const oldValue = (object as any)[prop];
      const isNewKey = !(prop in object);

      if (isPropString) newValue = makeReactive(newValue, depth, equalityCheck);

      const didSet = Reflect.set(target, prop, newValue, reciever);
      if (!didSet || !isPropString) return didSet;

      if (isNewKey) {
        if (prop in hasNodes) hasNodes[prop].broadcastEvent(ReactiveEvent.Changed);
        keysNode.broadcastEvent(ReactiveEvent.Changed);
      }

      if (prop in valueNodes && !equalityCheck(getRaw(newValue), getRaw(oldValue)))
        valueNodes[prop].broadcastEvent(ReactiveEvent.Changed);

      return didSet;
    },
    has(target, prop) {
      const hasProp = Reflect.has(target, prop);
      if (!TrackStack.isTracking || typeof prop !== 'string') return hasProp;

      if (!(prop in hasNodes)) {
        hasNodes[prop] = new SubscribableNode();
        addDependency(object, hasNodes[prop]);
      }

      hasNodes[prop].track();

      return hasProp;
    },
    deleteProperty(target, prop) {
      removeDependency(object, (object as any)[prop]);

      const didDelete = Reflect.deleteProperty(target, prop);
      if (!didDelete || typeof prop !== 'string') return didDelete;

      if (prop in valueNodes) valueNodes[prop].broadcastEvent(ReactiveEvent.Changed);
      if (prop in hasNodes) hasNodes[prop].broadcastEvent(ReactiveEvent.Changed);
      keysNode.broadcastEvent(ReactiveEvent.Changed);

      return didDelete;
    },
    ownKeys(target) {
      const keys = Reflect.ownKeys(target);

      keysNode.track();

      return keys;
    }
  }) as T;

  setRaw(proxy, object);

  for (const key of keysOf(object)) object[key] = makeReactive(object[key], depth, equalityCheck);

  return proxy;
}

export { makeObjectReactive };
