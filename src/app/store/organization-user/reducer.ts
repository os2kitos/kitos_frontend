import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultGridState } from 'src/app/shared/models/grid-state.model';
import { OrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';
import { OrganizationUserActions } from './actions';
import { OrganizationUserState } from './state';
import { OrganizationUnitActions } from '../organization-unit/actions';
import { ITContractActions } from '../it-contract/actions';
import { ITSystemUsageActions } from '../it-system-usage/actions';
import { DataProcessingActions } from '../data-processing/actions';

export const organizationUserAdapter = createEntityAdapter<OrganizationUser>({
  selectId: (user) => user.Uuid,
});

export const organizationUserInitialState: OrganizationUserState = organizationUserAdapter.getInitialState({
  total: 0,
  isLoadingUsersQuery: false,
  gridState: defaultGridState,
  gridColumns: [],
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
        const previousValue = state.entities[userUuid];
        if (!previousValue) return state;
        return organizationUserAdapter.updateOne(
          {
            id: userUuid,
            changes: {
              OrganizationUnitRights: previousValue.OrganizationUnitRights.filter(
                (right) => right.role.uuid !== roleUuid && right.entity.uuid !== unitUuid
              ),
            },
          },
          state
        );
      }
    ),

    on(
      ITSystemUsageActions.removeItSystemUsageRoleSuccess,
      (state, { userUuid, roleUuid, itSystemUsageUuid }): OrganizationUserState => {
        const previousValue = state.entities[userUuid];
        if (!previousValue) return state;
        return organizationUserAdapter.updateOne(
          {
            id: userUuid,
            changes: {
              ItSystemRights: previousValue.ItSystemRights.filter(
                (right) => right.role.uuid !== roleUuid && right.entity.uuid !== itSystemUsageUuid
              ),
            },
          },
          state
        );
      }
    ),

    on(
      ITContractActions.removeItContractRoleSuccess,
      (state, { userUuid, roleUuid, contractUuid }): OrganizationUserState => {
        const previousValue = state.entities[userUuid];
        if (!previousValue) return state;
        return organizationUserAdapter.updateOne(
          {
            id: userUuid,
            changes: {
              ItContractRights: previousValue.ItContractRights.filter(
                (right) => right.role.uuid !== roleUuid && right.entity.uuid !== contractUuid
              ),
            },
          },
          state
        );
      }
    ),

    on(
      DataProcessingActions.removeDataProcessingRoleSuccess,
      (state, { userUuid, roleUuid, dataProcessingUuid }): OrganizationUserState => {
        const previousValue = state.entities[userUuid];
        if (!previousValue) return state;
        return organizationUserAdapter.updateOne(
          {
            id: userUuid,
            changes: {
              DataProcessingRegistrationRights: previousValue.DataProcessingRegistrationRights.filter(
                (right) => right.role.uuid !== roleUuid && right.entity.uuid !== dataProcessingUuid
              ),
            },
          },
          state
        );
      }
    )
  ),
});
