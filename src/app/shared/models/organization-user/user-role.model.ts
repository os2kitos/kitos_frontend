import { APIUserResponseDTO } from 'src/app/api/v2';

export interface UserRoleChoice {
  name: string;
  value: APIUserResponseDTO.RolesEnum;
}

export const userRoleChoiceOptions: UserRoleChoice[] = [
  {
    name: $localize`Lokal admin`,
    value: APIUserResponseDTO.RolesEnum.LocalAdmin,
  },
  {
    name: $localize`Organisations admin`,
    value: APIUserResponseDTO.RolesEnum.OrganizationModuleAdmin,
  },
  {
    name: $localize`System admin`,
    value: APIUserResponseDTO.RolesEnum.SystemModuleAdmin,
  },
  {
    name: $localize`Kontrakt admin`,
    value: APIUserResponseDTO.RolesEnum.ContractModuleAdmin,
  },
  {
    name: $localize`Rettighedshaveradgang`,
    value: APIUserResponseDTO.RolesEnum.RightsHolderAccess,
  },
];

export const mapUserRoleChoice = (value?: APIUserResponseDTO.RolesEnum): UserRoleChoice | undefined => {
  return userRoleChoiceOptions.find((option) => option.value === value);
};
