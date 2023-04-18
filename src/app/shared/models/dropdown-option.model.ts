import { APIOrganizationUserResponseDTO, APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { READ_TEXT, WRITE_TEXT } from '../constants';

export interface DropdownOption {
  uuid: string;
  name: string;
  description?: string;
}

export const mapUserToOption = (user: APIOrganizationUserResponseDTO): DropdownOption => {
  return {
    uuid: user.uuid,
    name: user.name,
    description: user.email,
  };
};

export const mapRoleToDropdownOptions = (role: APIRoleOptionResponseDTO): DropdownOption => {
  return {
    uuid: role.uuid,
    name: `${role.name} (${role.writeAccess ? WRITE_TEXT : READ_TEXT})`,
    description: role.description,
  };
};
