import { createEntityAdapter, Update } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultGridState } from 'src/app/shared/models/grid-state.model';
import {
  adaptOrganizationUser,
  OrganizationUser,
} from 'src/app/shared/models/organization-user/organization-user.model';
import { DataProcessingActions } from '../data-processing/actions';
import { filterRightFromRights, updateStateOfUserRights } from '../helpers/right-helper';
import { ITContractActions } from '../it-contract/actions';
import { ITSystemUsageActions } from '../it-system-usage/actions';
import { OrganizationUnitActions } from '../organization-unit/actions';
import { OrganizationUserActions } from './actions';
import { OrganizationUserState } from './state';

export const organizationUserAdapter = createEntityAdapter<OrganizationUser>({
  selectId: (user) => user.Uuid,
});

export const organizationUserInitialState: OrganizationUserState = organizationUserAdapter.getInitialState({
  total: 0,
  isLoadingUsersQuery: false,
  gridState: defaultGridState,
  gridColumns: [],
  permissions: undefined,
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
      OrganizationUnitActions.deleteOrganizationUnitRoleSuccess,
      (state, { userUuid, roleUuid, unitUuid }): OrganizationUserState => {
        const partialUpdateFunction = (previousState: OrganizationUser) => ({
          OrganizationUnitRights: filterRightFromRights(previousState.OrganizationUnitRights, roleUuid, unitUuid),
        });
        return updateStateOfUserRights(state, userUuid, partialUpdateFunction);
      }
    ),

    on(
      ITSystemUsageActions.removeItSystemUsageRoleSuccess,
      (state, { userUuid, roleUuid, itSystemUsageUuid }): OrganizationUserState => {
        const partialUpdateFunction = (previousState: OrganizationUser) => ({
          ItSystemRights: filterRightFromRights(previousState.ItSystemRights, roleUuid, itSystemUsageUuid),
        });
        return updateStateOfUserRights(state, userUuid, partialUpdateFunction);
      }
    ),

    on(
      ITContractActions.removeItContractRoleSuccess,
      (state, { userUuid, roleUuid, contractUuid }): OrganizationUserState => {
        const partialUpdateFunction = (previousState: OrganizationUser) => ({
          ItContractRights: filterRightFromRights(previousState.ItContractRights, roleUuid, contractUuid),
        });
        return updateStateOfUserRights(state, userUuid, partialUpdateFunction);
      }
    ),

    on(
      DataProcessingActions.removeDataProcessingRoleSuccess,
      (state, { userUuid, roleUuid, dataProcessingUuid }): OrganizationUserState => {
        const partialUpdateFunction = (previousState: OrganizationUser) => ({
          DataProcessingRegistrationRights: filterRightFromRights(
            previousState.DataProcessingRegistrationRights,
            roleUuid,
            dataProcessingUuid
          ),
        });
        return updateStateOfUserRights(state, userUuid, partialUpdateFunction);
      }
    ),

    on(OrganizationUserActions.getUserPermissionsSuccess, (state, { permissions }): OrganizationUserState => {
      return {
        ...state,
        permissions,
      };
    }),

    on(OrganizationUserActions.sendNotificationSuccess, (state, { userUuid }): OrganizationUserState => {
      const todaysDate = new Date();
      const changes: Update<OrganizationUser> = { id: userUuid, changes: { LastAdvisSent: todaysDate.toISOString() } };
      return organizationUserAdapter.updateOne(changes, state);
    }),

    on(OrganizationUserActions.updateUserSuccess, (state, { user }): OrganizationUserState => {
      if (!user.uuid) return state;
      const updatedUser = adaptOrganizationUser(user);
      if (!updatedUser) return state;
      const changes: Update<OrganizationUser> = { id: user.uuid, changes: updatedUser };
      return organizationUserAdapter.updateOne(changes, state);
    })
  ),
});
