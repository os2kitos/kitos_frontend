import { createSelector } from "@ngrx/store";
import { itInterfaceAdapter, itInterfaceFeature } from "./reducer";

const { selectITInterfaceState } = itInterfaceFeature;


export const selectAll = createSelector(selectITInterfaceState, itInterfaceAdapter.getSelectors().selectAll);
export const selectTotal = createSelector(selectITInterfaceState, (state) => state.total);
export const selectInterfaceGridLoading = createSelector(selectITInterfaceState, (state) => state.isLoadingInterfacesQuery);
export const selectInterfaceGridState = createSelector(selectITInterfaceState, (state) => state.gridState);
export const selectInterfaceGridData = createSelector(selectAll, selectTotal, (data, total) => ({data, total}))
)
