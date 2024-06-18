import { createSelector } from '@ngrx/store';
import { itInterfaceAdapter, itInterfaceFeature } from './reducer';

const { selectITInterfaceState } = itInterfaceFeature;

export const selectAll = createSelector(selectITInterfaceState, itInterfaceAdapter.getSelectors().selectAll);
export const selectTotal = createSelector(selectITInterfaceState, (state) => state.total);
export const selectInterfaceGridLoading = createSelector(
  selectITInterfaceState,
  (state) => state.isLoadingInterfacesQuery
);
export const selectInterfaceGridState = createSelector(selectITInterfaceState, (state) => state.gridState);
export const selectInterfaceGridData = createSelector(selectAll, selectTotal, (data, total) => ({
  data,
  total,
}));
export const selectInterfaceGridColumns = createSelector(selectITInterfaceState, (state) => state.gridColumns);

export const selectInterface = createSelector(selectITInterfaceState, (state) => state.itInterface);
export const selectInterfaceName = createSelector(selectInterface, (itInterface) => itInterface?.name);
export const selectInterfaceUuid = createSelector(selectInterface, (itInterface) => itInterface?.uuid);

export const selectInterfaceData = createSelector(selectInterface, (itInterface) => itInterface?.data);
export const selectInterfaceUrlReference = createSelector(selectInterface, (itInterface) => itInterface?.urlReference);
export const selectIsInterfaceLoading = createSelector(selectITInterfaceState, (state) => state.loading);

export const selectInterfaceHasReadPermission = createSelector(
  selectITInterfaceState,
  (state) => state.permissions?.read
);
export const selectInterfaceHasModifyPermission = createSelector(
  selectITInterfaceState,
  (state) => state.permissions?.modify
);
export const selectInterfaceHasDeletePermission = createSelector(
  selectITInterfaceState,
  (state) => state.permissions?.delete
);
export const selectInterfaceDeletionConflicts = createSelector(
  selectITInterfaceState,
  (state) => state.permissions?.deletionConflicts
);
export const selectInterfaceHasCreateCollectionPermission = createSelector(
  selectITInterfaceState,
  (state) => state.collectionPermissions?.create
);
