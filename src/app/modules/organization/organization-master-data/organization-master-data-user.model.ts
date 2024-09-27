import { APIOrganizationUserResponseDTO } from "src/app/api/v2";

export function adaptMasterDataOrganizationUser(source: APIOrganizationUserResponseDTO): MasterDataOrganizationUser {
  return {
    firstName: source.firstName,
    lastName: source.lastName,
    uuid: source.uuid,
    email: source.email,
    phone: source.phoneNumber,
  };
}

export interface MasterDataOrganizationUser {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  uuid: string;
}
