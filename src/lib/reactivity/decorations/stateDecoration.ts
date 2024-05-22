import { StateNode, StateOptions } from '../nodes/StateNode';
import { DecorationType } from './decorationType';
import { StringKeyof } from '../utils/utilTypes';
import { addDependency } from '../dependencies';
import { BaseDecoration } from './decorations';

interface StateDecoration extends BaseDecoration {
  type: DecorationType.State;
  options?: StateOptions;
}

const createStateDecoration = <T>(property: string, options?: StateOptions): StateDecoration => ({
  type: DecorationType.State,
  property,
  options
});

interface StateDecorationOptions extends StateOptions {}

const createStateDecorationForObject = <TObject, TProp extends StringKeyof<TObject>>(
  object: TObject,
  property: TProp,
  options?: StateDecorationOptions
) => createStateDecoration(property, options);

function applyStateDecoration<T>(target: any, decoration: StateDecoration) {
  const node = new StateNode<T>(target[decoration.property], decoration.options);

  Object.defineProperty(target, decoration.property, {
    configurable: false,
    get: () => node.value,
    set: (value: T) => (node.value = value)
  });

  addDependency(target, node);
}

export {
  StateDecoration,
  applyStateDecoration,
  createStateDecoration,
  createStateDecorationForObject,
  StateDecorationOptions
};
