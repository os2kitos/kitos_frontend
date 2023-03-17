import { createSelector } from '@ngrx/store';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { contractTypeAdapter, contractTypeFeature } from './reducer';

const { selectContractTypeState, selectCacheTime } = contractTypeFeature;

export const selectContractTypes = createSelector(
  selectContractTypeState,
  contractTypeAdapter.getSelectors().selectAll
);

export const selectHasValidCache = createSelector(
  selectCacheTime,
  () => new Date(),
  (cacheTime, time) => hasValidCache(cacheTime, time)
);
