import { createSelector } from '@ngrx/store';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { kleAdapter, kleFeature } from './reducer';

const { selectKLEState, selectCacheTime } = kleFeature;

export const selectKLEs = createSelector(selectKLEState, kleAdapter.getSelectors().selectAll);
export const selectKLEEntities = createSelector(selectKLEState, kleAdapter.getSelectors().selectEntities);

export const selectHasValidCache = createSelector(
  selectCacheTime,
  () => new Date(),
  (cacheTime, time) => hasValidCache(cacheTime, time)
);
