import { map, Observable, UnaryFunction } from 'rxjs';

export function filterUndefinedInArray<T>(): UnaryFunction<Observable<(T | undefined)[]>, Observable<T[]>> {
  return map((a) => a.filter((x): x is T => !!x));
}
