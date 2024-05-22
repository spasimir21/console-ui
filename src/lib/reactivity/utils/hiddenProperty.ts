import { isObject } from './isObject';

interface HiddenProperty<T, TSymbol extends symbol> {
  readonly get: (object: any) => T | null;
  readonly getOwn: (object: any) => T | null;
  readonly has: (object: any) => boolean;
  readonly hasOwn: (object: any) => boolean;
  readonly set: (object: any, value: T) => void;
  readonly symbol: TSymbol;
}

function createHiddenProperty<T, TSymbol extends symbol>(symbol: TSymbol) {
  const property: HiddenProperty<T, TSymbol> = {
    get: (object: any) => {
      if (!isObject(object)) return null;
      return (object[symbol] ?? null) as T | null;
    },
    getOwn: (object: any) => (property.hasOwn(object) ? property.get(object) : null),
    has: (object: any) => {
      if (!isObject(object)) return false;
      return symbol in object;
    },
    hasOwn: (object: any) => Object.getOwnPropertySymbols(object).includes(symbol),
    set: (object: any, value: T) => {
      if (!isObject(object)) return;
      object[symbol] = value;
    },
    symbol
  } as const;

  return property;
}

export { createHiddenProperty, HiddenProperty };
