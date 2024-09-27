import { APIUserResponseDTO } from 'src/app/api/v2';

export interface UserRoleChoice {
  name: string;
  value: APIUserResponseDTO.RolesEnum;
  selected: boolean;
}

export const userRoleChoiceOptions: UserRoleChoice[] = [
  {
    name: $localize`Lokal admin`,
    value: APIUserResponseDTO.RolesEnum.LocalAdmin,
    selected: false,
  },
  {
    name: $localize`Organisations admin`,
    value: APIUserResponseDTO.RolesEnum.OrganizationModuleAdmin,
    selected: false,
  },
  {
    name: $localize`System admin`,
    value: APIUserResponseDTO.RolesEnum.SystemModuleAdmin,
    selected: false,
  },
  {
    name: $localize`Kontrakt admin`,
    value: APIUserResponseDTO.RolesEnum.ContractModuleAdmin,
    selected: false,
  },
  {
    name: $localize`Rettighedshaveradgang`,
    value: APIUserResponseDTO.RolesEnum.RightsHolderAccess,
    selected: false,
  },
];

export const mapUserRoleChoice = (value?: APIUserResponseDTO.RolesEnum): UserRoleChoice | undefined => {
  return userRoleChoiceOptions.find((option) => option.value === value);
};
