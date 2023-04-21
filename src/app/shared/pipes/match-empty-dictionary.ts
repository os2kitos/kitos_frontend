import { Dictionary } from '@ngrx/entity';
import { map, Observable, OperatorFunction, pipe, UnaryFunction } from 'rxjs';

export function matchEmptyDictionary<T>(): UnaryFunction<Observable<Dictionary<T>>, Observable<boolean>> {
  return pipe(map((x) => Object.keys(x).length === 0) as OperatorFunction<Dictionary<T>, boolean>);
}
