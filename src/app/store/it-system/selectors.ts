import { createSelector } from '@ngrx/store';
import { GridData } from 'src/app/shared/models/grid-data.model';
import { ITSystem } from 'src/app/shared/models/it-system/it-system.model';
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
export const selectITSystem1HasModifyPermission = createSelector(
  selectITSystemState,
  (state) => state.permissions?.modify
);
export const selectITSystemHasDeletePermission = createSelector(
  selectITSystemState,
  (state) => state.permissions?.delete
);
