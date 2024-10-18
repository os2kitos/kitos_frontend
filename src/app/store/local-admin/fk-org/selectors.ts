import { createSelector } from '@ngrx/store';
import { fkOrgFeature } from './reducer';

const { selectFkOrgState } = fkOrgFeature;

export const selectSynchronizationStatus = createSelector(selectFkOrgState, (state) => state.synchronizationStatus);
export const selectAccessError = createSelector(selectFkOrgState, (state) => state.accessError);
export const selectAccessGranted = createSelector(
  selectFkOrgState,
  (state) => state.synchronizationStatus?.accessStatus?.accessGranted
);
export const selectIsConnected = createSelector(selectFkOrgState, (state) => state.synchronizationStatus?.connected);
export const selectIsLoadingConnectionStatus = createSelector(
  selectFkOrgState,
  (state) => state.isLoadingConnectionStatus
);

export const selectSnapshot = createSelector(selectFkOrgState, (state) => state.snapshot);
export const selectIsSynchronizationDialogLoading = createSelector(
  selectFkOrgState,
  (state) => state.isSynchronizationDialogLoading
);
export const selectHasSnapshotFailed = createSelector(selectFkOrgState, (state) => state.hasSnapshotFailed);
