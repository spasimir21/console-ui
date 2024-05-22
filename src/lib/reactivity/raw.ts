import { createHiddenProperty } from './utils/hiddenProperty';

const $RAW = Symbol('$RAW');

const Raw = createHiddenProperty<any, typeof $RAW>($RAW);

const setRaw = (object: any, raw: any) => Raw.set(object, raw);

const getRaw = <T>(object: T) => (Raw.get(object) ?? object) as T;

export { setRaw, getRaw };
