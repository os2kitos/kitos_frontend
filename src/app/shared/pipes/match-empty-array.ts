import { map, Observable, OperatorFunction, pipe, UnaryFunction } from 'rxjs';

export function matchEmptyArray<T>(): UnaryFunction<Observable<Array<T>>, Observable<boolean>> {
  return pipe(map((x) => x.length === 0) as OperatorFunction<Array<T>, boolean>);
}
