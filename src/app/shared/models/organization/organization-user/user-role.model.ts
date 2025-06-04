import { APIUserResponseDTO } from 'src/app/api/v2';
import { MultiSelectDropdownItem } from '../../dropdown-option.model';
import { OrganizationRight } from '../../organization-right.model';
import { hasRoleInOrganization } from 'src/app/shared/helpers/role-helpers';
import { LOCAL_ADMIN_ROLE, ORGANIZATION_ADMIN_ROLE } from 'src/app/shared/constants/role.constants';

export interface UserRoleChoice {
  name: string;
  value: APIUserResponseDTO.RolesEnum;
  selected: boolean;
  dataCy?: string;
}

export const userRoleChoiceOptions: UserRoleChoice[] = [
  {
    name: $localize`Lokal admin`,
    value: APIUserResponseDTO.RolesEnum.LocalAdmin,
    selected: false,
    dataCy: 'local-admin-option',
  },
  {
    name: $localize`Organisations admin`,
    value: APIUserResponseDTO.RolesEnum.OrganizationModuleAdmin,
    selected: false,
    dataCy: 'organization-admin-option',
  },
  {
    name: $localize`System admin`,
    value: APIUserResponseDTO.RolesEnum.SystemModuleAdmin,
    selected: false,
    dataCy: 'system-admin-option',
  },
  {
    name: $localize`Kontrakt admin`,
    value: APIUserResponseDTO.RolesEnum.ContractModuleAdmin,
    selected: false,
    dataCy: 'contract-admin-option',
  },
];

export const mapUserRoleChoice = (value?: APIUserResponseDTO.RolesEnum): UserRoleChoice | undefined => {
  return userRoleChoiceOptions.find((option) => option.value === value);
};

export function GetOptionsBasedOnRights(
  isGlobalAdmin: boolean,
  organziationRights: OrganizationRight[],
  organizationUuid: string,
): MultiSelectDropdownItem<APIUserResponseDTO.RolesEnum>[] {
  const hasRole = (role: number) => hasRoleInOrganization(organziationRights, organizationUuid, role);
  const isLocalAdmin = hasRole(LOCAL_ADMIN_ROLE);
  const isOrgAdmin = hasRole(ORGANIZATION_ADMIN_ROLE);
  return userRoleChoiceOptions.map((option) =>
    mapUserRoleChoiceToMultiSelectOption(isGlobalAdmin, isLocalAdmin, isOrgAdmin, option),
  );
}

function mapUserRoleChoiceToMultiSelectOption(
  isGlobalAdmin: boolean,
  isLocalAdmin: boolean,
  isOrgAdmin: boolean,
  item: UserRoleChoice,
): MultiSelectDropdownItem<APIUserResponseDTO.RolesEnum> {
  if (isGlobalAdmin || isLocalAdmin) return { ...item, disabled: false };
  if (item.value === APIUserResponseDTO.RolesEnum.OrganizationModuleAdmin && isOrgAdmin)
    return { ...item, disabled: false };
  return { ...item, disabled: true };
}
