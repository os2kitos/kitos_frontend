import { RegularOptionType } from './regular-option-types.model';
import { RoleOptionTypes } from './role-option-types.model';

export interface LocalAdminOptionTypeItem {
  uuid: string;
  active: boolean;
  name: string;
  writeAccess: boolean | undefined;
  description: string | undefined;
  obligatory: boolean;
}

export type LocalAdminOptionType = RegularOptionType | RoleOptionTypes;
