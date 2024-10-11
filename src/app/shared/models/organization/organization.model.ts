
export interface Organization {
  id: string;
  Uuid: string;
  Name: string;
  Cvr: string;
  TypeId: OrganizationType;
  ForeignBusiness: string;
}

export interface OrganizationType {
  name: string;
  value:  number;
}

export const organizationTypeOptions: OrganizationType[] = [
  {
    name: 'Kommune',
    value: 1,
  },
  {
    name: 'Interessefællesskab',
    value: 2,
  },
  {
    name: 'Virksomhed',
    value: 3,
  },
  {
    name: 'Anden offentlig myndighed',
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
    TypeId: adaptOrganizationType(value.TypeId),
    ForeignBusiness: value.ForeignCvr,
  };
  console.log(adapted);
  return adapted;
};

function adaptOrganizationType(typeId: number): OrganizationType {
  return organizationTypeOptions[typeId - 1];
}
