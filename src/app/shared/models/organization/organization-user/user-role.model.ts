import { APIOrganizationRoleChoice, APIUserCollectionEditPermissionsResponseDTO } from 'src/app/api/v2';
import { LOCAL_ADMIN_ROLE } from 'src/app/shared/constants/role.constants';
import { hasRoleInOrganization } from 'src/app/shared/helpers/role-helpers';
import { MultiSelectDropdownItem } from '../../dropdown-option.model';
import { OrganizationRight } from '../../organization-right.model';

export interface UserRoleChoice {
  name: string;
  value: APIOrganizationRoleChoice;
  selected: boolean;
  dataCy?: string;
}

export const userRoleChoiceOptions: UserRoleChoice[] = [
  {
    name: $localize`Lokal admin`,
    value: APIOrganizationRoleChoice.LocalAdmin,
    selected: false,
    dataCy: 'local-admin-option',
  },
  {
    name: $localize`Organisations admin`,
    value: APIOrganizationRoleChoice.OrganizationModuleAdmin,
    selected: false,
    dataCy: 'organization-admin-option',
  },
  {
    name: $localize`System admin`,
    value: APIOrganizationRoleChoice.SystemModuleAdmin,
    selected: false,
    dataCy: 'system-admin-option',
  },
  {
    name: $localize`Kontrakt admin`,
    value: APIOrganizationRoleChoice.ContractModuleAdmin,
    selected: false,
    dataCy: 'contract-admin-option',
  },
];

export const mapUserRoleChoice = (value?: APIOrganizationRoleChoice): UserRoleChoice | undefined => {
  return userRoleChoiceOptions.find((option) => option.value === value);
};

export function GetOptionsBasedOnRights(
  isGlobalAdmin: boolean,
  organziationRights: OrganizationRight[],
  modifyPermissions: APIUserCollectionEditPermissionsResponseDTO | undefined,
  organizationUuid: string,
): MultiSelectDropdownItem<APIOrganizationRoleChoice>[] {
  const hasRole = (role: string) => hasRoleInOrganization(organziationRights, organizationUuid, role);
  const isLocalAdmin = hasRole(LOCAL_ADMIN_ROLE);
  return userRoleChoiceOptions.map((option) =>
    mapUserRoleChoiceToMultiSelectOption(isGlobalAdmin, isLocalAdmin, modifyPermissions, option),
  );
}

function mapUserRoleChoiceToMultiSelectOption(
  isGlobalAdmin: boolean,
  isLocalAdmin: boolean,
  modifyPermissions: APIUserCollectionEditPermissionsResponseDTO | undefined,
  item: UserRoleChoice,
): MultiSelectDropdownItem<APIOrganizationRoleChoice> {
  if (!modifyPermissions) return { ...item, disabled: true };

  if (isGlobalAdmin || isLocalAdmin) return { ...item, disabled: false };
  if (modifyPermissions.modifyContractRole && item.value === APIOrganizationRoleChoice.ContractModuleAdmin)
    return { ...item, disabled: false };
  if (modifyPermissions.modifyOrganizationRole && item.value === APIOrganizationRoleChoice.OrganizationModuleAdmin)
    return { ...item, disabled: false };
  if (modifyPermissions.modifySystemRole && item.value === APIOrganizationRoleChoice.SystemModuleAdmin)
    return { ...item, disabled: false };

  return { ...item, disabled: true };
}
