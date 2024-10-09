import { createSelector } from '@ngrx/store';
import { OrganizationState } from './state';
import { organizationFeature } from './reducer';

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
