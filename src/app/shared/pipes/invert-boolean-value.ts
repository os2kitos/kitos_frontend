import { map, Observable, OperatorFunction, pipe, UnaryFunction } from 'rxjs';

export function invertBooleanValue(): UnaryFunction<Observable<boolean>, Observable<boolean>> {
  return pipe(map((b) => !b) as OperatorFunction<boolean, boolean>);
}
