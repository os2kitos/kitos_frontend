import { createSelector } from '@ngrx/store';
import { organizationAdapter, organizationFeature } from './reducer';

const { selectOrganizationState } = organizationFeature;

export const selectOrganizations = createSelector(
  selectOrganizationState,
  organizationAdapter.getSelectors().selectAll
);
export const selectOrganizationEntities = createSelector(
  selectOrganizationState,
  organizationAdapter.getSelectors().selectEntities
);
export const selectOrganizationsTotal = createSelector(
  selectOrganizationState,
  organizationAdapter.getSelectors().selectTotal
);

export const selectHasMultipleOrganizations = createSelector(selectOrganizationsTotal, (total) => total > 1);
