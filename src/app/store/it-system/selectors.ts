import { createSelector } from '@ngrx/store';
import { itSystemAdapter, itSystemFeature } from './reducer';

const { selectITSystemState } = itSystemFeature;

export const selectAll = createSelector(selectITSystemState, itSystemAdapter.getSelectors().selectAll);

export const selectItSystemLoading = createSelector(selectITSystemState, (state) => state.loading);
export const selectItSystem = createSelector(selectITSystemState, (state) => state.itSystem);

export const selectItSystemIsActive = createSelector(selectItSystem, (state) =>
  state?.deactivated !== undefined ? !state.deactivated : undefined
);

export const selectItSystemParentSystem = createSelector(selectItSystem, (state) => state?.parentSystem);

export const selectItSystemKle = createSelector(selectItSystem, (state) => state?.kle);
export const selectItSystemKleUuids = createSelector(selectItSystem, (state) => state?.kle.map((kle) => kle.uuid));
