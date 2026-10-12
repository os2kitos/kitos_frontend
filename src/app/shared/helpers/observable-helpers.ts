import { concatLatestFrom } from '@ngrx/operators';
import { Observable, OperatorFunction, combineLatest, of, defer, catchError, shareReplay, startWith, switchMap } from 'rxjs';
import { filter, map, scan, tap } from 'rxjs/operators';
import { Cached } from '../models/cache-item.model';
import { hasValidCache } from './date.helpers';

/**
 * Combines an array of boolean Observables using logical AND.
 * @param observables - Array of boolean Observables
 * @returns An Observable that emits true if all source Observables emit true.
 */
export function combineAND(observables: Observable<boolean>[]): Observable<boolean> {
  return combineLatest(observables).pipe(map((values: boolean[]) => values.every((value) => value)));
}

/**
 * Combines an array of boolean Observables using logical OR.
 * @param observables - Array of boolean Observables
 * @returns An Observable that emits true if any source Observable emits true.
 */
export function combineOR(observables: Observable<boolean>[]): Observable<boolean> {
  return combineLatest(observables).pipe(map((values: boolean[]) => values.some((value) => value)));
}

/**
 * Debug operator that logs the value of the observable.
 * @param label - Optional label to prepend to the log message.
 * @returns An operator function that logs the value of the observable.
 */
export function debugPipe<T>(label?: string) {
  return tap<T>((value) => {
    if (label) {
      console.log(`${label}:`, value);
    } else {
      console.log(value);
    }
  });
}
/**
 *
 * @param cached$ - Observable of Cached<T> object
 * @returns An operator function that filters out the source observable if the cache is not valid.
 */
export function filterByValidCache<T>(cached$: Observable<Cached<T>>) {
  return (source$: Observable<unknown>) =>
    source$.pipe(
      concatLatestFrom(() => cached$),
      filter(([, cache]) => !hasValidCache(cache?.cacheTime)),
    );
}

export function mapArray<T, U>(fn: (item: T) => U): OperatorFunction<T[], U[]> {
  return map((arr: T[]) => arr.map(fn));
}

/**
 * Maps an observable of `{ enabled: boolean; recommended: boolean }` to an observable of `boolean` (the `enabled` field).
 */
export function mapUIConfigStatusToEnabled(): OperatorFunction<{ enabled: boolean; recommended: boolean }, boolean> {
  return map(({ enabled }) => enabled);
}

/**
 * Maps an observable of `{ enabled: boolean; recommended: boolean }` to an observable of `boolean` (the `recommended` field).
 */
export function mapUIConfigStatusToRecommended(): OperatorFunction<{ enabled: boolean; recommended: boolean }, boolean> {
  return map(({ enabled, recommended }) => enabled && recommended);
}

/**
 * Aggregate recommended-badge state for a group of fields (e.g. all recommended fields shown on a single details tab).
 */
export interface RecommendedBadgeState {
  /** True if at least one field in the group is recommended (i.e. the badge should be shown at all). */
  visible: boolean;
  /** True if every recommended field in the group is filled in. Fields that are not recommended never block this. */
  filled: boolean;
}

/**
 * Combines the recommended/filled state of a set of fields into a single tab-level recommended badge state.
 * @param fields - Array of `{ recommended$, filled$ }` pairs, one per recommended-capable field on the tab.
 * @returns An Observable of `RecommendedBadgeState` where `visible` is true if any field is recommended, and
 * `filled` is true if every recommended field is filled in (non-recommended fields are ignored).
 */
export function combineRecommendedBadgeState(
  fields: { recommended$: Observable<boolean>; filled$: Observable<boolean> }[],
): Observable<RecommendedBadgeState> {
  if (fields.length === 0) {
    return of({ visible: false, filled: false });
  }

  const fieldStates$ = fields.map(({ recommended$, filled$ }) =>
    combineLatest([recommended$, filled$]).pipe(map(([recommended, filled]) => ({ recommended, filled }))),
  );

  return combineLatest(fieldStates$).pipe(
    map((states) => ({
      visible: states.some((state) => state.recommended),
      filled: states.every((state) => !state.recommended || state.filled),
    })),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}

/** Load recommended collections, retaining their badge state while refreshing the same registration. */
export function recommendedCollectionFilled<T extends { uuid: string }>(
  entity$: Observable<T | undefined>,
  recommended$: Observable<boolean>,
  load: (entity: T) => Observable<unknown[]>,
): Observable<boolean> {
  const initialState: { uuid: string | undefined; filled: boolean } = { uuid: undefined, filled: false };
  return combineLatest([entity$, recommended$]).pipe(
    switchMap(([entity, recommended]) => {
      const uuid = entity?.uuid;
      return entity && recommended
        ? defer(() => load(entity)).pipe(
          map((items) => ({ uuid, filled: items.length > 0 })),
          startWith({ uuid, filled: undefined }),
          catchError(() => of({ uuid, filled: false })),
        )
        : of({ uuid, filled: false });
    }),
    scan(
      (previous, current) => ({
        uuid: current.uuid,
        filled: current.filled ?? (previous.uuid === current.uuid && previous.filled),
      }),
      initialState,
    ),
    map(({ filled }) => filled),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
