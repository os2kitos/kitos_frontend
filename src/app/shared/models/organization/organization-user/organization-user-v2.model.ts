import { APIOrganizationUserResponseDTO } from 'src/app/api/v2';

export function adaptOrganizationUserV2(source: APIOrganizationUserResponseDTO): OrganizationUserV2 {
  return {
    firstName: source.firstName,
    lastName: source.lastName,
    uuid: source.uuid,
    email: source.email,
    phone: source.phoneNumber,
    fullName: `${source.firstName} ${source.lastName}`,
  };
}

export interface OrganizationUserV2 {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  uuid: string;
  fullName: string;
}
