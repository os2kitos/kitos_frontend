/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { hasValidTwoMinuteCache } from './date.helpers';

export interface HasPermissions {
  permissions: any;
}

export interface HasCollectionPermissions {
  collectionPermissions: any;
}

export function createHasValidPermissionsCacheSelector<T extends HasPermissions>(
  stateSelector: MemoizedSelector<Record<string, any>, T, (featureState: T) => T>
) {
  return createSelector(
    stateSelector,
    () => new Date(),
    (state, now) => {
      return hasValidTwoMinuteCache(state.permissions?.cacheTime, now);
    }
  );
}

export function createHasValidCollectionPermissionsCacheSelector<T extends HasCollectionPermissions>(
  stateSelector: MemoizedSelector<Record<string, any>, T, (featureState: T) => T>
) {
  return createSelector(
    stateSelector,
    () => new Date(),
    (state, now) => {
      return hasValidTwoMinuteCache(state.collectionPermissions?.cacheTime, now);
    }
  );
}
