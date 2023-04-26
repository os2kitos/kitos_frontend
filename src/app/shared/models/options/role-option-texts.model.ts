import { RoleOptionTypes } from './role-option-types.model';

export interface RoleOptionTexts {
  name: string;
}

export const RoleOptionTypeTexts: Record<RoleOptionTypes, RoleOptionTexts> = {
  'it-system-usage': {
    name: $localize`Systemrolle`,
  },
};
