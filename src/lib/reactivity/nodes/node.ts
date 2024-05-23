interface ReadableNode<T> {
  readonly value: T;
}

interface WritableNode<T> {
  value: T;
}

const readableNode = <T>(getter: () => T): ReadableNode<T> => ({
  get value() {
    return getter();
  }
});

const writableNode = <T>(getter: () => T, setter: (value: T) => void): WritableNode<T> => ({
  get value() {
    return getter();
  },
  set value(value) {
    setter(value);
  }
});

const propertyRef = <T, TProp extends keyof T>(object: T, prop: TProp): WritableNode<T[TProp]> => ({
  get value() {
    return object[prop];
  },
  set value(value) {
    object[prop] = value;
  }
});

export { ReadableNode, WritableNode, readableNode, writableNode, propertyRef };
