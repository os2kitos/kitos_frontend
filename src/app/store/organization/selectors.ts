import { createSelector } from '@ngrx/store';
import { EntityLoadingState } from 'src/app/shared/models/entity-loading-state.model';
import { organizationAdapter, organizationFeature } from './reducer';

const { selectOrganizationState, selectLoadingState } = organizationFeature;

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

export const selectOrganizationsIsLoaded = createSelector(
  selectLoadingState,
  (loadingState) => loadingState === EntityLoadingState.loaded
);

export const selectHasMultipleOrganizations = createSelector(selectOrganizationsTotal, (total) => total > 1);
