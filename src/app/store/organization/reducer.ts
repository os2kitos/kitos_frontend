import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { OrganizationActions } from './actions';
import { OrganizationState } from './state';
import { Organization } from 'src/app/shared/models/organization/organization.model';
import { defaultGridState } from 'src/app/shared/models/grid-state.model';

export const organizationAdapter = createEntityAdapter<Organization>();

export const organizationInitialState: OrganizationState = organizationAdapter.getInitialState({
  total: 0,
  isLoadingUsersQuery: false,
  gridState: defaultGridState,
  gridColumns: [],

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
    ),
    on(
      OrganizationActions.getOrganizations,
      (state): OrganizationState => ({ ...state, isLoadingUsersQuery: true })
    ),
    on(
      OrganizationActions.getOrganizationsSuccess,
      (state, { organizations, total }): OrganizationState => ({
        ...organizationAdapter.setAll(organizations, state),
        total,
        isLoadingUsersQuery: false,
      })
    ),
    on(
      OrganizationActions.getOrganizationsError,
      (state): OrganizationState => ({ ...state, isLoadingUsersQuery: false })
    ),
    on(
      OrganizationActions.updateGridState,
      (state, { gridState }): OrganizationState => ({
        ...state,
        isLoadingUsersQuery: true,
        gridState,
      })
    ),
  ),
});
