import { APIOrganizationResponseDTO } from 'src/app/api/v2';

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
  value: APIOrganizationResponseDTO.OrganizationTypeEnum;
}

export const OrganizationTypes: OrganizationType[] = [
  {
    name: 'Kommune',
    value: APIOrganizationResponseDTO.OrganizationTypeEnum.Municipality,
  },
  {
    name: 'Interessefællesskab',
    value: APIOrganizationResponseDTO.OrganizationTypeEnum.CommunityOfInterest,
  },
  {
    name: 'Virksomhed',
    value: APIOrganizationResponseDTO.OrganizationTypeEnum.Company,
  },
  {
    name: 'Anden offentlig myndighed',
    value: APIOrganizationResponseDTO.OrganizationTypeEnum.OtherPublicAuthority,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptOrganization = (value: any): Organization | undefined => {
  const adapted = {
    id: value.Uuid,
    Uuid: value.Uuid,
    Name: value.Name,
    Cvr: value.Cvr,
    OrganizationType: adaptOrganizationType(value.TypeId).name,
    ForeignBusiness: value.ForeignCvr,
  };
  console.log(adapted);
  return adapted;
};

function adaptOrganizationType(typeId: number): OrganizationType {
  return OrganizationTypes[typeId - 1];
}
