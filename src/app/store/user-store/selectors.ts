import { createSelector } from '@ngrx/store';
import { rightsIncludesLocalAdminInOrg } from 'src/app/shared/helpers/role-helpers';
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
export const selectOrganizationCvr = createSelector(selectOrganization, (organization) => organization?.cvr);
export const selectOrganizationType = createSelector(
  selectOrganization,
  (organization) => organization?.organizationType
);

export const selectUserIsGlobalAdmin = createSelector(selectUser, (user) => user?.isGlobalAdmin ?? false);
export const selectUserUuid = createSelector(selectUser, (user) => user?.uuid);
export const selectUserOrganizationUuid = createSelector(selectUser, (user) => user?.defaultOrganizationUuid);
export const selectUserIsCurrentlyLocalAdmin = createSelector(
  selectUser,
  selectOrganizationUuid,
  (user, organizationUuid) => rightsIncludesLocalAdminInOrg(user?.organizationRights, organizationUuid)
);

export const selectUserDefaultUnitUuid = createSelector(selectUser, (user) => user?.defaultUnitUuid);

export const selectHasCheckedUserAndOrganization = createSelector(
  selectUser,
  selectHasTriedAuthenticating,
  selectHasMultipleOrganizations,
  (user, hasTriedAuthenticating, hasMultipleOrganizations) =>
    (hasTriedAuthenticating && !user) || (hasTriedAuthenticating && hasMultipleOrganizations !== undefined)
);

export const selectGridPermissions = createSelector(selectUserState, (state) => state.gridPermissions);

export const selectGridConfigModificationPermission = createSelector(
  selectGridPermissions,
  (permissions) => permissions?.hasConfigModificationPermissions
);
