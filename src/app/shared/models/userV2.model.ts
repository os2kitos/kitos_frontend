import { APIUserReferenceResponseDTO } from "src/app/api/v2";

export interface ShallowUser {
  name: string;
  email: string;
  uuid: string;
}

export function adaptShallowUser(dto: APIUserReferenceResponseDTO): ShallowUser {
  return {
    name: dto.name,
    email: dto.email,
    uuid: dto.uuid,
  };
}
