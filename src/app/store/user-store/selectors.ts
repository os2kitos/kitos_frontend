import { createSelector } from '@ngrx/store';
import { userFeature } from './reducer';

export const { selectUser, selectIsAuthenticating, selectHasAuthenticated, selectOrganization } = userFeature;

export const selectOrganizationName = createSelector(selectOrganization, (organization) => organization?.name);

export const selectUserHasNoOrganization = createSelector(
  selectUser,
  selectOrganization,
  (user, organization) => user && !organization
);
