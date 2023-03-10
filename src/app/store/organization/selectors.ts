import { createSelector } from '@ngrx/store';
import { organizationAdapter, organizationFeature } from './reducer';

const { selectOrganizationState } = organizationFeature;

export const selectOrganizations = createSelector(
  selectOrganizationState,
  organizationAdapter.getSelectors().selectAll
);
export const selectOrganizationsTotal = createSelector(
  selectOrganizationState,
  organizationAdapter.getSelectors().selectTotal
);

export const selectHasMultipleOrganizations = createSelector(selectOrganizationsTotal, (total) => total > 1);
