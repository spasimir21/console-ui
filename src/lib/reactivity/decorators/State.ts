import { StateDecorationOptions, createStateDecorationForObject } from '../decorations/stateDecoration';
import { createDecorator } from './decorationDecorator';
import { Constructor } from '../utils/utilTypes';

const StateDecorator = createDecorator(createStateDecorationForObject);

function State(constructorOrPrototype: Constructor | object, propertyName: string): void;
function State(
  options: StateDecorationOptions
): (constructorOrPrototype: Constructor | object, propertyName: string) => void;
function State(constructorOrPrototypeOrOptions: Constructor | object, propertyName?: string) {
  return StateDecorator(constructorOrPrototypeOrOptions, propertyName);
}

export { State };
