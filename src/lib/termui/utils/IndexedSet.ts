interface IndexedSet<T> {
  add(item: T): number;
  get(index: number): T | null;
}

function createIndexedSet<T, K>(getKey: (item: T) => K): IndexedSet<T> {
  const itemMap = new Map<number, T>();
  const indexMap = new Map<K, number>();

  return {
    add(item) {
      const key = getKey(item);

      if (indexMap.has(key)) return indexMap.get(key)!;

      const index = itemMap.size;
      indexMap.set(key, index);
      itemMap.set(index, item);

      return index;
    },
    get(index) {
      return itemMap.get(index) ?? null;
    }
  };
}

export { createIndexedSet, IndexedSet };
