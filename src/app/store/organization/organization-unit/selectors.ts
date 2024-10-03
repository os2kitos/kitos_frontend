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

export const selectRegistrations = createSelector(selectOrganizationUnitState, (state) => state.registrations);
export const selectIsLoadingRegistrations = createSelector(
  selectOrganizationUnitState,
  (state) => state.isLoadingRegistrations
);
export const selectOrganizationUnitRightsRegistrations = createSelector(
  selectOrganizationUnitState,
  (state) => state.organizationUnitRights
);
export const selectItContractRegistrations = createSelector(
  selectOrganizationUnitState,
  (state) => state.itContractRegistrations
);
export const selectInternalPaymentsRegistrations = createSelector(
  selectOrganizationUnitState,
  (state) => state.internalPayments
);
export const selectExternalPaymentsRegistrations = createSelector(
  selectOrganizationUnitState,
  (state) => state.externalPayments
);
export const selectResponsibleSystemsRegistrations = createSelector(
  selectOrganizationUnitState,
  (state) => state.responsibleSystems
);
export const selectRelevantSystemsRegistrations = createSelector(
  selectOrganizationUnitState,
  (state) => state.relevantSystems
);

export const selectUnitPermissions = createSelector(selectOrganizationUnitState, (state) => state.permissions);
export const selectCollectionPermissions = createSelector(
  selectOrganizationUnitState,
  (state) => state.collectionPermissions
);

export const selectCurrentUnitUuid = createSelector(selectOrganizationUnitState, (state) => state.currentUnitUuid);
