import { createSelector } from '@ngrx/store';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { businessTypeAdapter, businessTypeFeature } from './reducer';

const { selectBusinessTypeState, selectCacheTime } = businessTypeFeature;

export const selectBusinessTypes = createSelector(
  selectBusinessTypeState,
  businessTypeAdapter.getSelectors().selectAll
);

export const selectHasValidCache = createSelector(
  selectCacheTime,
  () => new Date(),
  (cacheTime, time) => hasValidCache(cacheTime, time)
);
