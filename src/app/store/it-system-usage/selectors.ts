import { createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GridData } from 'src/app/shared/models/grid-data.model';
import { ITSystemUsage } from 'src/app/shared/models/it-system-usage.model';
import { ITSystemUsageState } from './state';

export const itSystemUsageAdapter = createEntityAdapter<ITSystemUsage>();
const selectItSystemUsageState = createFeatureSelector<ITSystemUsageState>('ITSystemUsage');

export const selectAll = createSelector(selectItSystemUsageState, itSystemUsageAdapter.getSelectors().selectAll);

export const selectTotal = createSelector(selectItSystemUsageState, (state) => state.total);
export const selectIsLoading = createSelector(selectItSystemUsageState, (state) => state.isLoading);
export const selectGridState = createSelector(selectItSystemUsageState, (state) => state.gridState);

export const selectGridData = createSelector(selectAll, selectTotal, (data, total): GridData => ({ data, total }));

export const selectItSystemUsage = createSelector(selectItSystemUsageState, (state) => state.itSystemUsage);
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

export const selectItSystemUsageDataClassificationTypes = createSelector(
  selectItSystemUsageState,
  (state) => state.itSystemUsageDataClassificationTypes
);

export const selectITSystemUsageHasReadPermission = createSelector(
  selectItSystemUsageState,
  (state) => state.permissions?.read ?? false
);
export const selectITSystemUsageHasModifyPermission = createSelector(
  selectItSystemUsageState,
  (state) => state.permissions?.modify ?? false
);
export const selectITSystemUsageHasDeletePermission = createSelector(
  selectItSystemUsageState,
  // TODO: Generated API is incorrect
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (state) => (state.permissions as any)?.delete ?? false
);

export const selectITSystemUsageIsRemoving = createSelector(selectItSystemUsageState, (state) => state.isRemoving);
