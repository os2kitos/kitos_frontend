export interface OrganizationOData {
  id: string;
  Uuid: string;
  Name: string;
  Cvr: string | undefined;
  OrganizationType: string;
  ForeignCountryCode: { Name: string; Uuid: string; Description: string };
}

export interface OrganizationType {
  name: string;
  value: OrganizationTypeEnum;
}

export enum OrganizationTypeEnum {
  Municipality = 1,
  CommunityOfInterest = 2,
  Company = 3,
  OtherPublicAuthority = 4,
}

export const organizationTypeOptions: OrganizationType[] = [
  {
    name: $localize`Kommune`,
    value: OrganizationTypeEnum.Municipality,
  },
  {
    name: $localize`Interessefællesskab`,
    value: OrganizationTypeEnum.CommunityOfInterest,
  },
  {
    name: $localize`Virksomhed`,
    value: OrganizationTypeEnum.Company,
  },
  {
    name: $localize`Anden offentlig myndighed`,
    value: OrganizationTypeEnum.OtherPublicAuthority,
  },
];

export const defaultOrganizationType = organizationTypeOptions[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptOrganization = (value: any): OrganizationOData | undefined => {
  const adapted: OrganizationOData = {
    id: value.Uuid,
    Uuid: value.Uuid,
    Name: value.Name,
    Cvr: value.Cvr ?? '',
    OrganizationType: adaptOrganizationType(value.TypeId).name,
    ForeignCountryCode: value.ForeignCountryCode,
  };
  return adapted;
};

export function getOrganizationType(name: string): OrganizationType | undefined {
  return organizationTypeOptions.find((type) => type.name === name);
}

function adaptOrganizationType(typeId: number): OrganizationType {
  return organizationTypeOptions[typeId - 1];
}
