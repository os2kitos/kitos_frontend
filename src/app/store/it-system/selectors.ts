import { createSelector } from '@ngrx/store';
import { GridData } from 'src/app/shared/models/grid-data.model';
import { ITSystem } from 'src/app/shared/models/it-system/it-system.model';
import { selectOrganizationUuid } from '../user-store/selectors';
import { itSystemAdapter, itSystemFeature } from './reducer';

const { selectITSystemState } = itSystemFeature;

export const selectAll = createSelector(selectITSystemState, itSystemAdapter.getSelectors().selectAll);

export const selectTotal = createSelector(selectITSystemState, (state) => state.total);
export const selectSystemGridLoading = createSelector(selectITSystemState, (state) => state.isLoadingSystemsQuery);
export const selectSystemGridState = createSelector(selectITSystemState, (state) => state.gridState);
export const selectSystemGridData = createSelector(
  selectAll,
  selectTotal,
  (data, total): GridData<ITSystem> => ({ data, total })
);

export const selectItSystemLoading = createSelector(selectITSystemState, (state) => state.loading);
export const selectItSystem = createSelector(selectITSystemState, (state) => state.itSystem);

export const selectItSystemIsActive = createSelector(selectItSystem, (state) =>
  state?.deactivated !== undefined ? !state.deactivated : undefined
);
export const selectItSystemIsInUseInOrganization = createSelector(
  selectItSystem,
  selectOrganizationUuid,
  (state, organizationUuid) => {
    const organizations = state?.usingOrganizations.filter((organization) => organization.uuid === organizationUuid);
    return organizations && organizations.length > 0;
  }
);

export const selectItSystemParentSystem = createSelector(selectItSystem, (state) => state?.parentSystem);

export const selectItSystemKle = createSelector(selectItSystem, (state) => state?.kle);
export const selectItSystemKleUuids = createSelector(selectItSystem, (state) => state?.kle.map((kle) => kle.uuid));
export const selectItSystemRecomendedArchiveDutyComment = createSelector(
  selectItSystem,
  (state) => state?.recommendedArchiveDuty
);

export const selectItSystemUuid = createSelector(selectItSystem, (state) => state?.uuid);
export const selectItSystemName = createSelector(selectItSystem, (state) => state?.name);

export const selectITSystemHasReadPermission = createSelector(selectITSystemState, (state) => state.permissions?.read);
export const selectITSystemHasModifyPermission = createSelector(
  selectITSystemState,
  (state) => state.permissions?.modify
);
export const selectITSystemHasDeletePermission = createSelector(
  selectITSystemState,
  (state) => state.permissions?.delete
);
export const selectITSystemCanModifyVisibilityPermission = createSelector(
  selectITSystemState,
  (state) => state.permissions?.modifyVisibility
);
export const selectItSystemDeletetionConflicts = createSelector(
  selectITSystemState,
  (state) => state.permissions?.deletionConflicts
);
export const selectItSystemExternalReferences = createSelector(selectItSystem, (state) => state?.externalReferences);
