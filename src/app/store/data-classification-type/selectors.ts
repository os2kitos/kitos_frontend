import { createSelector } from '@ngrx/store';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { dataClassificationTypeAdapter, dataClassificationTypeFeature } from './reducer';

const { selectDataClassificationTypeState, selectCacheTime } = dataClassificationTypeFeature;

export const selectDataClassificationTypes = createSelector(
  selectDataClassificationTypeState,
  dataClassificationTypeAdapter.getSelectors().selectAll
);

export const selectHasValidCache = createSelector(
  selectCacheTime,
  () => new Date(),
  (cacheTime, time) => hasValidCache(cacheTime, time)
);
