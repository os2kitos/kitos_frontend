import { createSelector } from '@ngrx/store';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { organizationUnitAdapter, organizationUnitFeature } from './reducer';

const { selectOrganizationUnitState, selectCacheTime } = organizationUnitFeature;

export const selectOrganizationUnits = createSelector(
  selectOrganizationUnitState,
  organizationUnitAdapter.getSelectors().selectAll
);

export const selectExpandedNodeUuids = createSelector(selectOrganizationUnitState, (state) => state.expandedNodeUuids);

export const selectOrganizationUnitHasValidCache = createSelector(
  selectCacheTime,
  () => new Date(),
  (cacheTime, time) => hasValidCache(cacheTime, time)
);
