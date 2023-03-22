import { createSelector } from '@ngrx/store';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { regularOptionTypeAdapter, regularOptionTypeFeature } from './reducer';

const { selectRegularOptionTypeState, selectCacheTime } = regularOptionTypeFeature;

//TODO: Parameterized
export const selectRegularOptionTypes = createSelector(
  selectRegularOptionTypeState,
  regularOptionTypeAdapter.getSelectors().selectAll
);

//TODO: Parameterized
export const selectRegularOptionTypesDictionary = createSelector(
  selectRegularOptionTypeState,
  regularOptionTypeAdapter.getSelectors().selectEntities
);

//TODO: Parameterized
export const selectHasValidCache = createSelector(
  selectCacheTime,
  () => new Date(),
  (cacheTime, time) => hasValidCache(cacheTime, time)
);
