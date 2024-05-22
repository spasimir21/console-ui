function createMethodProxy<T extends object>(object: T) {
  const proxy: T = {} as any;

  for (const key of Object.keys(object) as (keyof T)[]) {
    if (typeof object[key] !== 'function') {
      proxy[key] = object[key];
      continue;
    }

    const originalFunction = object[key]! as (...args: any[]) => any;
    (proxy as any)[key] = (...args: any[]) => originalFunction.apply(object, args);
  }

  return proxy;
}

export { createMethodProxy };
