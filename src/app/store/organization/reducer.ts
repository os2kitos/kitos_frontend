import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { OrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organization-master-data.model';
import { OrganizationActions } from './actions';
import { OrganizationState } from './state';

export const organizationAdapter = createEntityAdapter<OrganizationMasterData>();

export const organizationInitialState: OrganizationState = organizationAdapter.getInitialState({
  organizationMasterData: null,
  organizationMasterDataRoles: null,
  permissions: null,
});

export const organizationFeature = createFeature({
  name: 'Organization',
  reducer: createReducer(
    organizationInitialState,
    on(OrganizationActions.getMasterData, (state): OrganizationState => state),
    on(
      OrganizationActions.getMasterDataSuccess,
      (state, organizationMasterData): OrganizationState => ({ ...state, organizationMasterData })
    ),
    on(
      OrganizationActions.getMasterDataError,
      (state): OrganizationState => ({ ...state, organizationMasterData: null })
    ),
    on(
      OrganizationActions.patchMasterDataSuccess,
      (state, organizationMasterData): OrganizationState => ({ ...state, organizationMasterData })
    ),
    on(OrganizationActions.patchMasterDataError, (state): OrganizationState => ({ ...state })),
    on(
      OrganizationActions.getMasterDataRolesSuccess,
      (state, organizationMasterDataRoles): OrganizationState => ({
        ...state,
        organizationMasterDataRoles,
      })
    ),
    on(
      OrganizationActions.getMasterDataRolesError,
      (state): OrganizationState => ({ ...state, organizationMasterDataRoles: null })
    ),
    on(
      OrganizationActions.patchMasterDataRolesSuccess,
      (state, organizationMasterDataRoles): OrganizationState => ({ ...state, organizationMasterDataRoles })
    ),
    on(OrganizationActions.patchMasterDataRolesError, (state): OrganizationState => ({ ...state })),
    on(
      OrganizationActions.getOrganizationPermissionsSuccess,
      (state, permissions): OrganizationState => ({ ...state, permissions })
    ),
    on(
      OrganizationActions.getOrganizationPermissionsError,
      (state): OrganizationState => ({ ...state, permissions: null })
    )
  ),
});
