import { createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { OrganizationState } from './state';

export const organizationAdapter = createEntityAdapter<APIOrganizationResponseDTO>({
  selectId: (organization) => organization.uuid,
});
const selectState = createFeatureSelector<OrganizationState>('Organization');

export const selectOrganizations = createSelector(selectState, organizationAdapter.getSelectors().selectAll);
export const selectOrganizationsTotal = createSelector(selectState, organizationAdapter.getSelectors().selectTotal);

export const selectHasMultipleOrganizations = createSelector(selectOrganizationsTotal, (total) => total > 1);
