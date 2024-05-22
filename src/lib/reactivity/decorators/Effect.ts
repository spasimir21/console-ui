import { EffectDecorationOptions, createEffectDecorationForObject } from '../decorations/effectDecoration';
import { createDecorator } from './decorationDecorator';
import { Constructor } from '../utils/utilTypes';

const EffectDecorator = createDecorator(createEffectDecorationForObject);

function Effect(
  constructorOrPrototype: Constructor | object,
  propertyName: string,
  descriptor?: PropertyDescriptor
): void;
function Effect<T>(
  options: EffectDecorationOptions<T>
): (constructorOrPrototype: Constructor | object, propertyName: string, descriptor?: PropertyDescriptor) => void;
function Effect(
  constructorOrPrototypeOrOptions: Constructor | object,
  propertyName?: string,
  descriptor?: PropertyDescriptor
) {
  return EffectDecorator(constructorOrPrototypeOrOptions, propertyName, descriptor);
}

export { Effect };
