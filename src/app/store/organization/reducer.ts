import { createFeature, createReducer, on } from '@ngrx/store';
import { OrganizationActions } from './actions';
import { organizationAdapter } from './selectors';
import { initialState, OrganizationState } from './state';

export const organizationFeature = createFeature({
  name: 'Organization',
  reducer: createReducer(
    initialState,
    on(
      OrganizationActions.getOrganizationsSuccess,
      (state, { organizations }): OrganizationState => ({
        ...organizationAdapter.setAll(organizations, state),
      })
    )
  ),
});
