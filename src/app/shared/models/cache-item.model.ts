export type Cached<T> = {
  value: T | undefined;
  cacheTime: number | undefined;
};

export function newCache<T>(value: T | undefined): Cached<T> {
  return {
    value,
    cacheTime: Date.now(),
  };
}

export function resetCache<T>(): Cached<T> {
  return {
    value: undefined,
    cacheTime: undefined,
  };
}
