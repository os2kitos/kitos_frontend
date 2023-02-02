import { APIOrganizationResponseDTO } from 'src/app/api/v2';

export interface Organization {
  uuid: string;
  name: string;
}

export const adaptOrganization = (organization: APIOrganizationResponseDTO): Organization => {
  return {
    uuid: organization.uuid,
    name: organization.name,
  };
};
