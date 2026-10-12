import { Selector, Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { RecommendedBadgeState, mapUIConfigStatusToRecommended } from './observable-helpers';

export type RecommendedSelector = Selector<object, { enabled: boolean; recommended: boolean }>;

export interface RegistrationRecommendedBadges {
  roles$: Observable<RecommendedBadgeState>;
  references$: Observable<RecommendedBadgeState>;
  notifications$: Observable<RecommendedBadgeState>;
}

/** Bind recommendation selectors and completion checks to the same registration stream. */
export function recommendedField<T>(store: Store, entity$: Observable<T>) {
  return (selector: RecommendedSelector, filled: (entity: T) => boolean) => ({
    recommended$: store.select(selector).pipe(mapUIConfigStatusToRecommended()),
    filled$: entity$.pipe(map(filled)),
  });
}

export function hasText(value: string | null | undefined): boolean {
  return !!value?.trim();
}

export function hasValue<T>(value: T | null | undefined): boolean {
  return value !== null && value !== undefined;
}
