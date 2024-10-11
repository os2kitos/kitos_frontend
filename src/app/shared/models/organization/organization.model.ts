export interface Organization {
  Name: string;
  Cvr: string;
  OrganizationType: string;
  ForeignBusiness: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptOrganization = (value: any): Organization | undefined => {
  const adapted =  {
    Name: value.Name,
    Cvr: value.Cvr,
    OrganizationType: value.TypeId,
    ForeignBusiness: value.ForeignCvr,
  };
  console.log(adapted);
  return adapted;
}
