import { createSelector } from '@ngrx/store';
import { organizationUnitAdapter, organizationUnitFeature } from './reducer';

const { selectOrganizationUnitState } = organizationUnitFeature;

export const selectOrganizationUnits = createSelector(
  selectOrganizationUnitState,
  organizationUnitAdapter.getSelectors().selectAll
);

export const selectOrganizationUnitsIsLoaded = createSelector(
  selectOrganizationUnitState,
  (state) => state.isLoaded === true
);
