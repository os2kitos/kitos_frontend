import { createSelector } from '@ngrx/store';
import { userFeature } from './reducer';

export const {
  selectUser,
  selectXsrfToken,
  selectIsAuthenticating,
  selectHasTriedAuthenticating,
  selectOrganization,
  selectHasMultipleOrganizations,
} = userFeature;

const { selectUserState } = userFeature;

export const selectOrganizationName = createSelector(selectOrganization, (organization) => organization?.name);
export const selectOrganizationUuid = createSelector(selectOrganization, (organization) => organization?.uuid);

export const selectUserIsGlobalAdmin = createSelector(selectUser, (user) => user?.isGlobalAdmin ?? false);

export const selectHasCheckedUserAndOrganization = createSelector(
  selectUser,
  selectHasTriedAuthenticating,
  selectHasMultipleOrganizations,
  (user, hasTriedAuthenticating, hasMultipleOrganizations) =>
    (hasTriedAuthenticating && !user) || (hasTriedAuthenticating && hasMultipleOrganizations !== undefined)
);

export const selectGridPermissions = createSelector(selectUserState, (state) => state.gridPermissions);

export const selectGridConfigModificationPermission = createSelector(selectGridPermissions, (permissions) => permissions?.hasConfigModificationPermissions);
