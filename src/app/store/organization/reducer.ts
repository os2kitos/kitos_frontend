import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { OrganizationActions } from './actions';
import { OrganizationState } from './state';

export const organizationAdapter = createEntityAdapter<APIOrganizationResponseDTO>({
  selectId: (organization) => organization.uuid,
});

export const organizationInitialState: OrganizationState = organizationAdapter.getInitialState({});

export const organizationFeature = createFeature({
  name: 'Organization',
  reducer: createReducer(
    organizationInitialState,
    on(
      OrganizationActions.getOrganizationsSuccess,
      (state, { organizations }): OrganizationState => ({
        ...organizationAdapter.setAll(organizations, state),
      })
    )
  ),
});
