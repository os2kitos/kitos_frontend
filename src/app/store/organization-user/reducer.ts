import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultGridState } from 'src/app/shared/models/grid-state.model';
import { OrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';
import { OrganizationUserActions } from './actions';
import { OrganizationUserState } from './state';

export const organizationUserAdapter = createEntityAdapter<OrganizationUser>();

export const organizationUserInitialState: OrganizationUserState = organizationUserAdapter.getInitialState({
  total: 0,
  isLoadingUsersQuery: false,
  gridState: defaultGridState,
  gridColumns: [],

  permissions: null,
});

export const organizationUserFeature = createFeature({
  name: 'OrganizationUser',
  reducer: createReducer(
    organizationUserInitialState,
    on(
      OrganizationUserActions.getOrganizationUsers,
      (state): OrganizationUserState => ({ ...state, isLoadingUsersQuery: true })
    ),
    on(
      OrganizationUserActions.getOrganizationUsersSuccess,
      (state, { users, total }): OrganizationUserState => ({
        ...organizationUserAdapter.setAll(users, state),
        total,
        isLoadingUsersQuery: false,
      })
    ),
    on(
      OrganizationUserActions.getOrganizationUsersError,
      (state): OrganizationUserState => ({ ...state, isLoadingUsersQuery: false })
    ),
    on(OrganizationUserActions.updateGridColumnsSuccess, (state, { gridColumns }): OrganizationUserState => {
      return {
        ...state,
        gridColumns,
      };
    }),
    on(
      OrganizationUserActions.updateGridState,
      (state, { gridState }): OrganizationUserState => ({
        ...state,
        isLoadingUsersQuery: true,
        gridState,
      })
    ),
    on(
      OrganizationUserActions.getOrganizationUserPermissionsSuccess,
      (state, { permissions }): OrganizationUserState => ({
        ...state,
        permissions,
      })
    )
  ),
});
