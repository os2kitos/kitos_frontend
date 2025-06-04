export function areSetsEqual<T>(a: Set<T>, b: Set<T>): boolean {
  return a.size === b.size && Array.from(a).every((x) => b.has(x));
}
