import { createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APIKLEDetailsDTO } from 'src/app/api/v2';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { KLEState } from './state';

export const kleAdapter = createEntityAdapter<APIKLEDetailsDTO>({
  selectId: (kle) => kle.uuid,
});
const selectState = createFeatureSelector<KLEState>('KLE');

export const selectKLEs = createSelector(selectState, kleAdapter.getSelectors().selectAll);
export const selectKLEEntities = createSelector(selectState, kleAdapter.getSelectors().selectEntities);

export const selectHasValidCache = createSelector(
  selectState,
  () => new Date(),
  (state, time) => hasValidCache(state.cacheTime, time)
);
