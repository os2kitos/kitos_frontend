import { Observable, pipe, UnaryFunction } from 'rxjs';
import { invertBooleanValue } from './invert-boolean-value';
import { matchEmptyArray } from './match-empty-array';

export function matchNonEmptyArray<T>(): UnaryFunction<Observable<Array<T>>, Observable<boolean>> {
  return pipe(matchEmptyArray(), invertBooleanValue());
}
