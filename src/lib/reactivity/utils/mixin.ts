import { Constructor } from './utilTypes';

function applyStaticMixin(target: any, source: any) {
  const properties = [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)];

  for (const propertyName of properties) {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(source, propertyName);

      if (descriptor) Object.defineProperty(target, propertyName, descriptor);
      else target[propertyName] = source[propertyName];
    } catch (err) {}
  }
}

const applyMixin = (target: Constructor, source: Constructor) => applyStaticMixin(target.prototype, source.prototype);

export { applyMixin, applyStaticMixin };
