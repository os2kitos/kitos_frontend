import { APIOrganizationResponseDTO } from "src/app/api/v2";

export interface OrganizationType {
  name: string;
  value: APIOrganizationResponseDTO.OrganizationTypeEnum;
}

export const organizationTypeOptions: OrganizationType[] = [
  {
    name: $localize`Kommune`,
    value: APIOrganizationResponseDTO.OrganizationTypeEnum.Municipality
  },
  {
    name: $localize`Interessefællesskab`,
    value: APIOrganizationResponseDTO.OrganizationTypeEnum.CommunityOfInterest,
  },
  {
    name: $localize`Virksomhed`,
    value: APIOrganizationResponseDTO.OrganizationTypeEnum.Company,
   },
    {
      name: $localize`Anden offentlig myndighed`,
      value: APIOrganizationResponseDTO.OrganizationTypeEnum.OtherPublicAuthority,
    }
  ]

export const mapOrganizationType = (
value?: APIOrganizationResponseDTO.OrganizationTypeEnum): OrganizationType | undefined => {
  return organizationTypeOptions.find((option) => option.value === value);
}
