import { APIOrganizationResponseDTO } from 'src/app/api/v2';

export interface Organization {
  uuid: string;
  name: string;
}

export const adaptOrganization = (organisation: APIOrganizationResponseDTO): Organization => {
  return {
    uuid: organisation.uuid,
    name: organisation.name,
  };
};
