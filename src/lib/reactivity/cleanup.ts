import { getDependencies, hasDependents, removeDependency } from './dependencies';
import { createHiddenProperty } from './utils/hiddenProperty';
import { Constructor } from './utils/utilTypes';

const $IS_CLEANED_UP = Symbol('$IS_CLEANED_UP');
const $CLEANUP = Symbol('$CLEANUP');

const IsCleanedUp = createHiddenProperty<boolean, typeof $IS_CLEANED_UP>($IS_CLEANED_UP);
const Cleanup = createHiddenProperty<() => void, typeof $CLEANUP>($CLEANUP);

function cleanup(object: any) {
  if (isCleanedUp(object) || hasDependents(object)) return;

  IsCleanedUp.set(object, true);

  const cleanupFunc = Cleanup.get(object);
  if (cleanupFunc) cleanupFunc.call(object);

  for (const dependency of getDependencies(object)) {
    removeDependency(object, dependency);
    cleanup(dependency);
  }
}

function cleanupBase<TObject extends InstanceType<TClass>, TClass extends Constructor>(
  object: TObject,
  _class: TClass
) {
  const parentPrototype = Object.getPrototypeOf(_class.prototype);

  const cleanupFunc = Cleanup.get(parentPrototype);
  if (cleanupFunc) cleanupFunc.call(object);
}

const isCleanedUp = (object: any) => IsCleanedUp.getOwn(object) === true;

function addCleanup<T>(object: T, newCleanupFunc: (this: T) => void) {
  const oldCleanupFunc = Cleanup.get(object);

  const cleanupFunc = oldCleanupFunc
    ? function (this: T) {
        oldCleanupFunc.call(this);
        newCleanupFunc.call(this);
      }
    : newCleanupFunc;

  Cleanup.set(object, cleanupFunc);

  return cleanupFunc;
}

export { Cleanup, cleanup, cleanupBase, isCleanedUp, addCleanup };
