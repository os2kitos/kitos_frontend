import { createFeature, createReducer, on } from '@ngrx/store';
import { OrganizationActions } from './actions';
import { organizationAdapter } from './selectors';
import { organizationInitialState, OrganizationState } from './state';

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
