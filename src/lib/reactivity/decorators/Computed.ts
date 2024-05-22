import { ComputedDecorationOptions, createComputedDecorationForObject } from '../decorations/computedDecoration';
import { createDecorator } from './decorationDecorator';
import { Constructor } from '../utils/utilTypes';

const ComputedDecorator = createDecorator(createComputedDecorationForObject);

function Computed(
  constructorOrPrototype: Constructor | object,
  propertyName: string,
  descriptor?: PropertyDescriptor
): void;
function Computed<TObject>(
  options: ComputedDecorationOptions<TObject>
): (constructorOrPrototype: Constructor | object, propertyName: string, descriptor?: PropertyDescriptor) => void;
function Computed(
  constructorOrPrototypeOrOptions: Constructor | object,
  propertyName?: string,
  descriptor?: PropertyDescriptor
) {
  return ComputedDecorator(constructorOrPrototypeOrOptions, propertyName, descriptor);
}

export { Computed };
