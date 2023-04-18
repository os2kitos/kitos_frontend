import { createSelector } from '@ngrx/store';
import { selectKLEEntities } from '../kle/selectors';
import { itSystemAdapter, itSystemFeature } from './reducer';

const { selectITSystemState } = itSystemFeature;

export const selectAll = createSelector(selectITSystemState, itSystemAdapter.getSelectors().selectAll);

export const selectItSystem = createSelector(selectITSystemState, (state) => state.itSystem);

export const selectItSystemIsActive = createSelector(selectItSystem, (state) =>
  state?.deactivated !== undefined ? !state.deactivated : undefined
);

export const selectItSystemParentSystem = createSelector(selectItSystem, (state) => state?.parentSystem);

export const selectItSystemKle = createSelector(selectItSystem, (state) => state?.kle);

export const selectItSystemKleWithDetails = createSelector(selectItSystemKle, selectKLEEntities, (kle, kles) => {
  return kle?.map((kle) => kles[kle.uuid]);
});
