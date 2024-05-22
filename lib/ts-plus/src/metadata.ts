interface Metadata<T> {
  get(object: any): T | null;
  set(object: any, value: T): void;
}

function createMetadata<T>(name: string): Metadata<T> {
  const metadataSymbol = Symbol(name);

  return {
    get: object => {
      if (object == null || (typeof object !== 'object' && typeof object !== 'function')) return null;
      return object[metadataSymbol] ?? null;
    },
    set: (object, value) => (object[metadataSymbol] = value)
  };
}

export { createMetadata, Metadata };
