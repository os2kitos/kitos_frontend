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
