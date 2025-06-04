import {
  APIEmailRecipientResponseDTO,
  APIOrganizationUserResponseDTO,
  APIRegularOptionResponseDTO,
  APIRoleOptionResponseDTO,
  APIRoleRecipientResponseDTO,
} from 'src/app/api/v2';
import { NO_TEXT, YES_TEXT } from '../constants/constants';

export const booleanDropdownOptions: DropdownOption<boolean>[] = [
  { value: true, name: YES_TEXT },
  { value: false, name: NO_TEXT },
];

export function toBooleanDropdownOption(value: boolean | undefined) {
  return booleanDropdownOptions.find((option) => option.value === value) ?? undefined;
}

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

export interface MultiSelectDropdownItem<T> {
  name: string;
  value: T;
  selected: boolean;
  disabled?: boolean;
  dataCy?: string;
  description?: string;
}

export const mapUserToOption = (user: APIOrganizationUserResponseDTO): MultiSelectDropdownItem<string> => {
  return {
    value: user.uuid,
    name: user.name,
    description: user.email,
    selected: false,
  };
};

export const mapRoleToDropdownOptions = (role: APIRoleOptionResponseDTO): RoleDropdownOption => {
  return {
    uuid: role.uuid,
    name: role.name,
    description: `Skriv: ${role.writeAccess ? YES_TEXT : NO_TEXT}`,
  };
};

export const mapRegularOptionToMultiSelectItem = (
  option: APIRegularOptionResponseDTO,
): MultiSelectDropdownItem<string> => {
  return {
    name: option.name,
    value: option.uuid,
    selected: false,
  };
};

export const mapEmailOptionToMultiSelectItem = (
  option: APIEmailRecipientResponseDTO,
  selected: boolean,
): MultiSelectDropdownItem<string> => {
  return {
    name: option.email ?? '',
    value: option.email ?? '',
    selected: selected,
  };
};

export const mapRoleOptionToMultiSelectItem = (
  option: APIRoleRecipientResponseDTO,
  selected: boolean,
): MultiSelectDropdownItem<string> => {
  return {
    name: option.role?.name ?? '',
    value: option.role?.uuid ?? '',
    selected: selected,
  };
};
