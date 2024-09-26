import { createSelector } from '@ngrx/store';
import { organizationMasterDataFeature } from './reducer';
import { OrganizationMasterDataState } from './state';

export const { selectOrganizationMasterDataState } = organizationMasterDataFeature;

export const selectOrganizationMasterData = createSelector(
  selectOrganizationMasterDataState,
  (state: OrganizationMasterDataState) => {
    return state?.organizationMasterData ?? { uuid: '', name: '' };
  }
);

export const selectOrganizationMasterDataRoles = createSelector(
  selectOrganizationMasterDataState,
  (state: OrganizationMasterDataState) => {
    return state?.organizationMasterDataRoles ?? masterDataRolesEmptyState;
  }
);

const masterDataRolesEmptyState = {
  organizationUuid: '',
  ContactPerson: { lastName: '', phoneNumber: '', name: '', email: '', id: null },
  DataResponsible: { cvr: '', phone: '', address: '', name: '', email: '', id: null },
  DataProtectionAdvisor: { cvr: '', phone: '', address: '', name: '', email: '', id: null },
};
