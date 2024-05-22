import { Decoration, addDecoration, applyDecoration } from '../decorations/decorations';
import { Constructor } from '../utils/utilTypes';
import { markReactive } from '../reactiveFlag';

function createDecorator(decorationFactory: (object: any, property: string, options?: any) => Decoration) {
  function Decorator(
    constructorOrPrototype: Constructor | object,
    propertyName: string,
    descriptor?: PropertyDescriptor,
    options?: any
  ) {
    const decoration = decorationFactory(constructorOrPrototype, propertyName, options);

    // Static member
    if (typeof constructorOrPrototype === 'function') {
      markReactive(constructorOrPrototype);

      applyDecoration(constructorOrPrototype, decoration, descriptor);

      return;
    }

    // Instance member
    addDecoration(constructorOrPrototype.constructor as Constructor, decoration);
  }

  return (constructorOrPrototypeOrOptions: any, propertyName?: string, descriptor?: PropertyDescriptor) => {
    if (propertyName) return Decorator(constructorOrPrototypeOrOptions, propertyName, descriptor);
    return (constructorOrPrototype: Constructor | object, propertyName: string, descriptor?: PropertyDescriptor) =>
      Decorator(constructorOrPrototype, propertyName, descriptor, constructorOrPrototypeOrOptions as any);
  };
}

export { createDecorator };
