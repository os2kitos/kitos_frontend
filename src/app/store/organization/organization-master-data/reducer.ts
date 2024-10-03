import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { OrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organization-master-data.model';
import { OrganizationMasterDataActions } from './actions';
import { OrganizationMasterDataState } from './state';

export const organizationMasterDataAdapter = createEntityAdapter<OrganizationMasterData>();

export const organizationMasterDataInitialState: OrganizationMasterDataState =
  organizationMasterDataAdapter.getInitialState({
    organizationMasterData: null,
    organizationMasterDataRoles: null,
    permissions: null,
  });

export const organizationMasterDataFeature = createFeature({
  name: 'OrganizationMasterData',
  reducer: createReducer(
    organizationMasterDataInitialState,
    on(OrganizationMasterDataActions.getMasterData, (state): OrganizationMasterDataState => state),
    on(
      OrganizationMasterDataActions.getMasterDataSuccess,
      (state, organizationMasterData): OrganizationMasterDataState => ({ ...state, organizationMasterData })
    ),
    on(
      OrganizationMasterDataActions.getMasterDataError,
      (state): OrganizationMasterDataState => ({ ...state, organizationMasterData: null })
    ),
    on(
      OrganizationMasterDataActions.patchMasterDataSuccess,
      (state, organizationMasterData): OrganizationMasterDataState => ({ ...state, organizationMasterData })
    ),
    on(
      OrganizationMasterDataActions.patchMasterDataError,
      (state): OrganizationMasterDataState => ({ ...state })
    ),
    on(
      OrganizationMasterDataActions.getMasterDataRolesSuccess,
      (state, organizationMasterDataRoles): OrganizationMasterDataState => ({
        ...state,
        organizationMasterDataRoles,
      })
    ),
    on(
      OrganizationMasterDataActions.getMasterDataRolesError,
      (state): OrganizationMasterDataState => ({ ...state, organizationMasterDataRoles: null })
    ),
    on(
      OrganizationMasterDataActions.patchMasterDataRolesSuccess,
      (state, organizationMasterDataRoles): OrganizationMasterDataState => ({ ...state, organizationMasterDataRoles })
    ),
    on(
      OrganizationMasterDataActions.patchMasterDataRolesError,
      (state): OrganizationMasterDataState => ({ ...state })
    ),
    on(
      OrganizationMasterDataActions.getOrganizationPermissionsSuccess,
      (state, permissions): OrganizationMasterDataState => ({ ...state, permissions })
    ),
    on(
      OrganizationMasterDataActions.getOrganizationPermissionsError,
      (state): OrganizationMasterDataState => ({ ...state, permissions: null })
    ),
  ),
});
