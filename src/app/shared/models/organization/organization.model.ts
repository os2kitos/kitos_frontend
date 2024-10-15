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
  value: number;
}

export const organizationTypeOptions: OrganizationType[] = [
  {
    name: $localize`Kommune`,
    value: 1,
  },
  {
    name: $localize`Interessefællesskab`,
    value: 2,
  },
  {
    name: $localize`Virksomhed`,
    value: 3,
  },
  {
    name: $localize`Anden offentlig myndighed`,
    value: 4,
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
