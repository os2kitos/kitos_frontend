import { createSelector } from "@ngrx/store";
import { hasValidCache } from "src/app/shared/helpers/date.helpers";
import { interfaceTypeAdapter, interfaceTypeFeature } from "./reducer";

const { selectInterfaceTypeState, selectCacheTime} = interfaceTypeFeature;

export const selectInterfaceTypes = createSelector(
  selectInterfaceTypeState,
  interfaceTypeAdapter.getSelectors().selectAll
);

export const selectHasValidCache = createSelector(
  selectCacheTime,
  () => new Date(),
  (cacheTime, time) => hasValidCache(cacheTime, time)
);
