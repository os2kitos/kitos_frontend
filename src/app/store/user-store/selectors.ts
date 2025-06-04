import { createSelector } from '@ngrx/store';
import { LOCAL_ADMIN_ROLE } from 'src/app/shared/constants/role.constants';
import { hasRoleInOrganization } from 'src/app/shared/helpers/role-helpers';
import { GetOptionsBasedOnRights } from 'src/app/shared/models/organization/organization-user/user-role.model';
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
  (organization) => organization?.organizationType,
);

export const selectUserIsGlobalAdmin = createSelector(selectUser, (user) => user?.isGlobalAdmin ?? false);
export const selectUserUuid = createSelector(selectUser, (user) => user?.uuid);
export const selectUserOrganizationUuid = createSelector(selectUser, (user) => user?.defaultOrganizationUuid);
export const selectUserOrganizationName = createSelector(selectUser, (user) => user?.defaultOrganizationName);
export const selectUserOrganizationRights = createSelector(selectUser, (user) => user?.organizationRights);
export const selectUserIsCurrentlyLocalAdmin = createSelector(
  selectUserOrganizationRights,
  selectOrganizationUuid,
  (userOrgRights, organizationUuid) => hasRoleInOrganization(userOrgRights, organizationUuid, LOCAL_ADMIN_ROLE),
);

export const selectUserDefaultUnitUuid = createSelector(selectUserState, (state) => state.defaultUnit?.uuid);
export const selectUserDefaultUnit = createSelector(selectUserState, (state) => state.defaultUnit);

export const selectHasCheckedUserAndOrganization = createSelector(
  selectUser,
  selectHasTriedAuthenticating,
  selectHasMultipleOrganizations,
  (user, hasTriedAuthenticating, hasMultipleOrganizations) =>
    (hasTriedAuthenticating && !user) || (hasTriedAuthenticating && hasMultipleOrganizations !== undefined),
);

export const selectGridPermissions = createSelector(selectUserState, (state) => state.gridPermissions);

export const selectGridConfigModificationPermission = createSelector(
  selectGridPermissions,
  (permissions) => permissions?.hasConfigModificationPermissions,
);

export const selectAvailableRoleDropdownValues = createSelector(
  selectUserIsGlobalAdmin,
  selectUserOrganizationRights,
  selectOrganizationUuid,
  (isGlobalAdmin, organizationRights, organizationUuid) => {
    return GetOptionsBasedOnRights(isGlobalAdmin, organizationRights ?? [], organizationUuid ?? '');
  },
);

export const selectSsoErrorCode = createSelector(selectUserState, (state) => state.ssoErrorCode);
