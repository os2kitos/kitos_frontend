import { createSelector } from '@ngrx/store';
import { organizationAdapter, organizationFeature } from './reducer';
import { OrganizationState } from './state';

export const { selectOrganizationState } = organizationFeature;

export const selectOrganizationMasterData = createSelector(selectOrganizationState, (state: OrganizationState) => {
  return state?.organizationMasterData ?? { uuid: '', name: '' };
});

export const selectOrganizationMasterDataRoles = createSelector(selectOrganizationState, (state: OrganizationState) => {
  return state?.organizationMasterDataRoles ?? masterDataRolesEmptyState;
});

export const selectOrganizationHasModifyPermission = createSelector(
  selectOrganizationState,
  (state) => state.permissions?.modify
);

export const selectOrganizationHasModifyCvrPermission = createSelector(
  selectOrganizationState,
  (state) => state.permissions?.modifyCvr
);

const masterDataRolesEmptyState = {
  organizationUuid: '',
  ContactPerson: { lastName: '', phoneNumber: '', name: '', email: '', id: null },
  DataResponsible: { cvr: '', phone: '', address: '', name: '', email: '', id: null },
  DataProtectionAdvisor: { cvr: '', phone: '', address: '', name: '', email: '', id: null },
};

export const selectAll = createSelector(selectOrganizationState, organizationAdapter.getSelectors().selectAll);
export const selectTotal = createSelector(selectOrganizationState, (state) => state.total);
export const selectOrganizationGridLoading = createSelector(
  selectOrganizationState,
  (state) => state.isLoadingUsersQuery
);
export const selectOrganizationGridState = createSelector(selectOrganizationState, (state) => state.gridState);
export const selectOrganizationGridData = createSelector(selectAll, selectTotal, (data, total) => ({
  data,
  total,
}));
export const selectOrganizationGridColumns = createSelector(selectOrganizationState, (state) => state.gridColumns);

export const selectUIRootConfig = createSelector(selectOrganizationState, (state) => state.uiRootConfig);
export const selectShowItSystemModule = createSelector(
  selectOrganizationState,
  (state) => state.uiRootConfig?.showItSystemModule
);
export const selectShowDataProcessingModule = createSelector(
  selectOrganizationState,
  (state) => state.uiRootConfig?.showDataProcessing
);
