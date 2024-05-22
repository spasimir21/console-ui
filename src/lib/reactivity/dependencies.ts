import { createHiddenProperty } from './utils/hiddenProperty';
import { isObject } from './utils/isObject';
import { getRaw } from './raw';

const $DEPENDENCIES = Symbol('$DEPENDENCIES');
const $DEPENDENTS = Symbol('$DEPENDENTS');

const Dependencies = createHiddenProperty<Set<any>, typeof $DEPENDENCIES>($DEPENDENCIES);
const Dependents = createHiddenProperty<Set<any>, typeof $DEPENDENTS>($DEPENDENTS);

function addDependency<T>(target: any, dependency: T) {
  if (!isObject(dependency)) return;

  dependency = getRaw(dependency) as T;
  target = getRaw(target);

  if (dependency === target) return;

  if (Dependencies.hasOwn(target)) Dependencies.get(target)!.add(dependency);
  else Dependencies.set(target, new Set([dependency]));

  if (Dependents.hasOwn(dependency)) Dependents.get(dependency)!.add(target);
  else Dependents.set(dependency, new Set([target]));

  return dependency;
}

function removeDependency<T>(target: any, dependency: T) {
  if (!isObject(dependency)) return;

  dependency = getRaw(dependency) as T;
  target = getRaw(target);

  if (dependency === target) return;

  if (Dependencies.hasOwn(target)) Dependencies.get(target)!.delete(dependency);
  if (Dependents.hasOwn(dependency)) Dependents.get(dependency)!.delete(target);
  return dependency;
}

const getDependencies = (object: any) => Dependencies.getOwn(getRaw(object)) ?? new Set();
const hasDependents = (object: any) => (Dependents.getOwn(getRaw(object))?.size ?? 0) > 0;

export { addDependency, removeDependency, getDependencies, hasDependents };
