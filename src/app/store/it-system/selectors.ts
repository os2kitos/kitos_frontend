import { createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APIItSystemResponseDTO } from 'src/app/api/v2';
import { selectKLEEntities } from '../kle/selectors';
import { ITSystemState } from './state';

export const itSystemAdapter = createEntityAdapter<APIItSystemResponseDTO>();
const selectItSystemState = createFeatureSelector<ITSystemState>('ITSystem');

export const selectAll = createSelector(selectItSystemState, itSystemAdapter.getSelectors().selectAll);

export const selectItSystem = createSelector(selectItSystemState, (state) => state.itSystem);

export const selectItSystemDeactivated = createSelector(selectItSystem, (state) => state?.deactivated);

export const selectItSystemParentSystem = createSelector(selectItSystem, (state) => state?.parentSystem);

export const selectItSystemKle = createSelector(selectItSystem, (state) => state?.kle);

export const selectItSystemKleWithDetails = createSelector(selectItSystemKle, selectKLEEntities, (kle, kles) => {
  return kle?.map((kle) => kles[kle.uuid]);
});
