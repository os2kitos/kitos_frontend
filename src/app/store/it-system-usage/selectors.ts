import { createSelector } from '@ngrx/store';
import { GridData } from 'src/app/shared/models/grid-data.model';
import { itSystemUsageAdapter, itSystemUsageFeature } from './reducer';

const { selectITSystemUsageState } = itSystemUsageFeature;

export const selectAll = createSelector(selectITSystemUsageState, itSystemUsageAdapter.getSelectors().selectAll);

export const selectTotal = createSelector(selectITSystemUsageState, (state) => state.total);
export const selectIsLoading = createSelector(selectITSystemUsageState, (state) => state.isLoading);
export const selectGridState = createSelector(selectITSystemUsageState, (state) => state.gridState);

export const selectGridData = createSelector(selectAll, selectTotal, (data, total): GridData => ({ data, total }));

export const selectItSystemUsage = createSelector(selectITSystemUsageState, (state) => state.itSystemUsage);
export const selectItSystemUsageUuid = createSelector(selectItSystemUsage, (itSystemUsage) => itSystemUsage?.uuid);
export const selectItSystemUsageName = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.systemContext.name
);
export const selectItSystemUsageGeneral = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.general
);
export const selectItSystemUsageValid = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.general.validity.valid
);
export const selectItSystemUsageSystemContextUuid = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.systemContext.uuid
);

export const selectITSystemUsageHasReadPermission = createSelector(
  selectITSystemUsageState,
  (state) => state.permissions?.read ?? false
);
export const selectITSystemUsageHasModifyPermission = createSelector(
  selectITSystemUsageState,
  (state) => state.permissions?.modify ?? false
);
export const selectITSystemUsageHasDeletePermission = createSelector(
  selectITSystemUsageState,
  (state) => state.permissions?.delete ?? false
);

export const selectITSystemUsageIsRemoving = createSelector(selectITSystemUsageState, (state) => state.isRemoving);
