import { createSelector } from '@ngrx/store';
import { selectOrganizationEntities } from '../organization/selectors';
import { userFeature } from './reducer';

export const { selectUser, selectIsAuthenticating, selectHasTriedAuthenticating, selectOrganization } = userFeature;

export const selectOrganizationName = createSelector(selectOrganization, (organization) => organization?.name);
export const selectOrganizationUuid = createSelector(selectOrganization, (organization) => organization?.uuid);

export const selectUserOrganizationExists = createSelector(
  selectUser,
  selectOrganization,
  selectOrganizationEntities,
  (user, organization, organizationEntities) => !!user && !!organization && !!organizationEntities[organization.uuid]
);
