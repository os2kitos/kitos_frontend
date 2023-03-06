import { createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APIItSystemResponseDTO } from 'src/app/api/v2';
import { ITSystemState } from './state';

export const itSystemAdapter = createEntityAdapter<APIItSystemResponseDTO>();
const selectItSystemState = createFeatureSelector<ITSystemState>('ITSystem');

export const selectAll = createSelector(selectItSystemState, itSystemAdapter.getSelectors().selectAll);

export const selectItSystem = createSelector(selectItSystemState, (state) => state.itSystem);

export const selectItSystemKle = createSelector(selectItSystem, (state) => state?.kle);

export const selectItSystemDeactivated = createSelector(selectItSystem, (state) => state?.deactivated);
