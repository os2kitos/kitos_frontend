import { APIUserReferenceResponseDTO } from 'src/app/api/v2';

export interface GlobalAdminUser {
  name: string;
  email: string;
  uuid: string;
}

export function adaptGlobalAdminUser(dto: APIUserReferenceResponseDTO): GlobalAdminUser {
  return {
    name: dto.name,
    email: dto.email,
    uuid: dto.uuid,
  };
}
