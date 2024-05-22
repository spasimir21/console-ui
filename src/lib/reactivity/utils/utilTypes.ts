type AssertType<T, TAssert> = T extends TAssert ? T : never;

type StringKeyof<T> = AssertType<keyof T, string>;

type PropertiesOfType<T, TProp> = {
  [TKey in StringKeyof<T>]: T[TKey] extends TProp ? TKey : never;
}[StringKeyof<T>];

type ValuesOf<T> = T[keyof T];

type Constructor<T = any, TArgs extends [...any[]] = any[]> = new (...args: TArgs) => T;

export { AssertType, StringKeyof, PropertiesOfType, ValuesOf, Constructor };
