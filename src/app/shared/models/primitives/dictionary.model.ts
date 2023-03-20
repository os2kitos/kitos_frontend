export interface Dictionary<T> {
  [uuid: string]: T | undefined;
}
