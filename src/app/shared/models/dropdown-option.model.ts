import { APIOrganizationUserResponseDTO, APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { NO_TEXT, YES_TEXT } from '../constants';

export interface DropdownOption<T> {
  value: T;
  name: string;
  description?: string;
}

export interface RoleDropdownOption {
  uuid: string;
  name: string;
  description?: string;
}

export const mapUserToOption = (user: APIOrganizationUserResponseDTO): RoleDropdownOption => {
  return {
    uuid: user.uuid,
    name: user.name,
    description: user.email,
  };
};

export const mapRoleToDropdownOptions = (role: APIRoleOptionResponseDTO): RoleDropdownOption => {
  return {
    uuid: role.uuid,
    name: role.name,
    description: `Skriv: ${role.writeAccess ? YES_TEXT : NO_TEXT}`,
  };
};
