import { createHiddenProperty } from './utils/hiddenProperty';

const $IS_REACTIVE = Symbol('$IS_REACTIVE');

const IsReactive = createHiddenProperty<true, typeof $IS_REACTIVE>($IS_REACTIVE);

const markReactive = (object: any) => IsReactive.set(object, true);

const isReactive = (object: any) => IsReactive.getOwn(object) === true;

export { markReactive, isReactive };
