import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { EntityLoadingState } from 'src/app/shared/models/entity-loading-state.model';
import { OrganizationActions } from './actions';
import { OrganizationState } from './state';

export const organizationAdapter = createEntityAdapter<APIOrganizationResponseDTO>({
  selectId: (organization) => organization.uuid,
});

export const organizationInitialState: OrganizationState = organizationAdapter.getInitialState({
  loadingState: EntityLoadingState.initial,
});

export const organizationFeature = createFeature({
  name: 'Organization',
  reducer: createReducer(
    organizationInitialState,
    on(
      OrganizationActions.getOrganizations,
      (state): OrganizationState => ({ ...state, loadingState: EntityLoadingState.loading })
    ),
    on(
      OrganizationActions.getOrganizationsSuccess,
      (state, { organizations }): OrganizationState => ({
        ...organizationAdapter.setAll(organizations, state),
        loadingState: EntityLoadingState.loaded,
      })
    ),
    on(
      OrganizationActions.getOrganizationsError,
      (state): OrganizationState => ({ ...state, loadingState: EntityLoadingState.error })
    )
  ),
});
