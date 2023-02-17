import { createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GridData } from 'src/app/shared/models/grid-data.model';
import { ITSystemUsage } from 'src/app/shared/models/it-system-usage.model';
import { ITSystemUsageState } from './state';

export const itSystemUsageAdapter = createEntityAdapter<ITSystemUsage>();
const selectITSystemUsageState = createFeatureSelector<ITSystemUsageState>('ITSystemUsage');

export const selectAll = createSelector(selectITSystemUsageState, itSystemUsageAdapter.getSelectors().selectAll);

export const selectTotal = createSelector(selectITSystemUsageState, (state) => state.total);
export const selectIsLoading = createSelector(selectITSystemUsageState, (state) => state.isLoading);
export const selectGridState = createSelector(selectITSystemUsageState, (state) => state.gridState);

export const selectGridData = createSelector(selectAll, selectTotal, (data, total): GridData => ({ data, total }));

export const selectITSystemUsage = createSelector(selectITSystemUsageState, (state) => state.itSystemUsage);
export const selectITSystemUsageName = createSelector(
  selectITSystemUsage,
  (itSystemUsage) => itSystemUsage?.systemContext.name
);
export const selectITSystemUsageGeneral = createSelector(
  selectITSystemUsage,
  (itSystemUsage) => itSystemUsage?.general
);
