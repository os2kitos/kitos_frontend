import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Combines an array of boolean Observables using logical AND.
 * @param observables - Array of boolean Observables
 * @returns An Observable that emits true if all source Observables emit true.
 */
export function combineBooleansWithAnd(observables: Observable<boolean>[]): Observable<boolean> {
  return combineLatest(observables).pipe(map((values: boolean[]) => values.every((value) => value)));
}

/**
 * Combines an array of boolean Observables using logical OR.
 * @param observables - Array of boolean Observables
 * @returns An Observable that emits true if any source Observable emits true.
 */
export function combineBooleansWithOr(observables: Observable<boolean>[]): Observable<boolean> {
  return combineLatest(observables).pipe(map((values: boolean[]) => values.some((value) => value)));
}
