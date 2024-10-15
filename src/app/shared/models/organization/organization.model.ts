export interface Organization {
  id: string;
  Uuid: string;
  Name: string;
  Cvr: string;
  OrganizationType: string;
  ForeignBusiness: string;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptOrganization = (value: any): Organization | undefined => {
  const adapted: Organization = {
    id: value.Uuid,
    Uuid: value.Uuid,
    Name: value.Name,
    Cvr: value.Cvr,
    OrganizationType: adaptOrganizationType(value.TypeId).name,
    ForeignBusiness: value.ForeignCvr,
  };
  return adapted;
};

function adaptOrganizationType(typeId: number): OrganizationType {
  return organizationTypeOptions[typeId - 1];
}
