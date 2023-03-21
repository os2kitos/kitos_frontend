import { createSelector } from "@ngrx/store";
import { EntityLoadingState } from "../../shared/models/entity-loading-state.model";
import { organizationUnitAdapter, organizationUnitFeature } from "./reducer";

const { selectOrganizationUnitState, selectLoadingState } = organizationUnitFeature;

export const selectOrganizationUnits = createSelector(
  selectOrganizationUnitState,
  organizationUnitAdapter.getSelectors().selectAll
);

export const selectOrganizationUnitsIsLoaded = createSelector(
  selectLoadingState,
  (loadingState) => loadingState === EntityLoadingState.loaded
);
