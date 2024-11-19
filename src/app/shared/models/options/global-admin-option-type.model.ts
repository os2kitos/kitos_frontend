import { APIGlobalRoleOptionResponseDTO } from 'src/app/api/v2';
import { RegularOptionType } from './regular-option-types.model';
import { RoleOptionTypes } from './role-option-types.model';
import { GlobalRegularOptionType } from './global-regular-option-types.model';

export interface GlobalAdminOptionTypeItem {
  uuid: string;
  enabled: boolean;
  name: string;
  writeAccess: boolean | undefined;
  description: string | undefined;
  obligatory: boolean;
  priority: number;
}

export type GlobalAdminOptionType = RegularOptionType | RoleOptionTypes | GlobalRegularOptionType;

export function adaptGlobalAdminOptionType(dto: APIGlobalRoleOptionResponseDTO): GlobalAdminOptionTypeItem {
  const item: GlobalAdminOptionTypeItem = {
    enabled: dto.isEnabled ?? false,
    name: dto.name,
    writeAccess: dto.writeAccess,
    description: dto.description,
    uuid: dto.uuid,
    obligatory: dto.isObligatory ?? false,
    priority: dto.priority ?? 0,
  };
  return item;
}
