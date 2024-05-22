import { DependencyDecorationOptions, createDependencyDecorationForObject } from '../decorations/dependencyDecoration';
import { createDecorator } from './decorationDecorator';
import { Constructor } from '../utils/utilTypes';

const DependencyDecorator = createDecorator(createDependencyDecorationForObject);

function Dependency(constructorOrPrototype: Constructor | object, propertyName: string): void;
function Dependency(
  options: DependencyDecorationOptions
): (constructorOrPrototype: Constructor | object, propertyName: string) => void;
function Dependency(constructorOrPrototypeOrOptions: Constructor | object, propertyName?: string) {
  return DependencyDecorator(constructorOrPrototypeOrOptions, propertyName);
}

export { Dependency };
