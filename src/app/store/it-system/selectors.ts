import { createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GridData } from 'src/app/shared/models/grid-data.model';
import { ITSystem } from 'src/app/shared/models/it-system.model';
import { ITSystemState } from './state';

export const itSystemAdapter = createEntityAdapter<ITSystem>();
const selectITSystemState = createFeatureSelector<ITSystemState>('ITSystem');

export const selectAll = createSelector(selectITSystemState, itSystemAdapter.getSelectors().selectAll);

export const selectTotal = createSelector(selectITSystemState, (state) => state.total);
export const selectIsLoading = createSelector(selectITSystemState, (state) => state.isLoading);
export const selectGridState = createSelector(selectITSystemState, (state) => state.gridState);

export const selectGridData = createSelector(selectAll, selectTotal, (data, total): GridData => ({ data, total }));
