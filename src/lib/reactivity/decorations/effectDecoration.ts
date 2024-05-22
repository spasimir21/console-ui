import { EffectCallback, EffectNode, EffectOptions } from '../nodes/EffectNode';
import { PropertiesOfType } from '../utils/utilTypes';
import { DecorationType } from './decorationType';
import { addDependency } from '../dependencies';
import { BaseDecoration } from './decorations';
import { TrackStack } from '../TrackStack';

interface EffectDecoration extends BaseDecoration {
  type: DecorationType.Effect;
  effectCallback: EffectCallback;
  options?: EffectOptions;
}

const createEffectDecoration = (
  property: string,
  effectCallback: EffectCallback,
  options?: EffectOptions
): EffectDecoration => ({
  type: DecorationType.Effect,
  property,
  effectCallback,
  options
});

interface EffectDecorationOptions<TObject> extends EffectOptions {
  track?: (object: TObject) => any;
}

function createEffectDecorationForObject<TObject>(
  object: TObject,
  property: PropertiesOfType<TObject, EffectCallback>,
  options?: EffectDecorationOptions<TObject>
) {
  const objectCallback = object[property] as EffectCallback;

  const callback = options?.track
    ? function (this: TObject) {
        options.track!(this);

        TrackStack.pushTrackPause();
        const cleanupCallback = objectCallback.call(this);
        TrackStack.pop();

        return cleanupCallback;
      }
    : objectCallback;

  return createEffectDecoration(property, callback, {
    autorun: options?.autorun,
    scheduler: options?.scheduler
  });
}

function applyEffectDecoration(target: any, decoration: EffectDecoration, descriptor?: PropertyDescriptor) {
  const node = new EffectNode(decoration.effectCallback.bind(target), decoration.options);

  const newFunction = node.execute.bind(node);

  if (descriptor) {
    descriptor.configurable = false;
    descriptor.writable = false;
    descriptor.value = newFunction;
  } else {
    target[decoration.property] = newFunction;
  }

  addDependency(target, node);
}

export {
  EffectDecoration,
  applyEffectDecoration,
  createEffectDecoration,
  createEffectDecorationForObject,
  EffectDecorationOptions
};
