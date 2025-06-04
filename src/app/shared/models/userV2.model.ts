import { APIUserReferenceResponseDTO } from 'src/app/api/v2';
import { HasUuid } from './has-uuid';

export interface ShallowUser extends HasUuid {
  name: string;
  email: string;
}

export function toShallowUser(dto: APIUserReferenceResponseDTO): ShallowUser {
  return {
    name: dto.name,
    email: dto.email,
    uuid: dto.uuid,
  };
}
