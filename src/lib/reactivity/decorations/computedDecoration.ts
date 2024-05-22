import { ComputedNode, ComputedOptions } from '../nodes/ComputedNode';
import { DecorationType } from './decorationType';
import { StringKeyof } from '../utils/utilTypes';
import { addDependency } from '../dependencies';
import { BaseDecoration } from './decorations';
import { TrackStack } from '../TrackStack';

interface ComputedDecoration<T> extends BaseDecoration {
  type: DecorationType.Computed;
  getter: (this: any) => T;
  options?: ComputedOptions;
}

const createComputedDecoration = <T>(
  property: string,
  getter: (this: any) => T,
  options?: ComputedOptions
): ComputedDecoration<T> => ({
  type: DecorationType.Computed,
  property,
  getter,
  options
});

interface ComputedDecorationOptions<TObject> extends ComputedOptions {
  track?: (object: TObject) => any;
}

function createComputedDecorationForObject<TObject, TProp extends StringKeyof<TObject>>(
  object: TObject,
  property: TProp,
  options?: ComputedDecorationOptions<TObject>
) {
  const objectGetter = Object.getOwnPropertyDescriptor(object, property)!.get!;

  const getter = options?.track
    ? function (this: TObject) {
        options.track!(this);

        TrackStack.pushTrackPause();
        const result = objectGetter.call(this);
        TrackStack.pop();

        return result;
      }
    : objectGetter;

  return createComputedDecoration(property, getter, {
    equalityCheck: options?.equalityCheck,
    reactiveDepth: options?.reactiveDepth
  });
}

function applyComputedDecoration<T>(target: any, decoration: ComputedDecoration<T>, descriptor?: PropertyDescriptor) {
  const node = new ComputedNode<T>(decoration.getter.bind(target), decoration.options);

  const newDescriptor: PropertyDescriptor = {
    configurable: false,
    get: () => node.value
  };

  if (descriptor) Object.assign(descriptor, newDescriptor);
  else Object.defineProperty(target, decoration.property, newDescriptor);

  addDependency(target, node);
}

export {
  ComputedDecoration,
  applyComputedDecoration,
  createComputedDecoration,
  createComputedDecorationForObject,
  ComputedDecorationOptions
};
