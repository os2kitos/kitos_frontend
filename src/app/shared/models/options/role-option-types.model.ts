import { RegularOptionType } from './regular-option-types.model';

export type RoleOptionTypes = 'it-system-usage' | 'it-contract' | 'data-processing' | 'organization-unit';

export function isRoleOptionType(value: string): value is RoleOptionTypes {
  return ['it-system-usage', 'it-contract', 'data-processing', 'organization-unit'].includes(value);
}

export function isRegularOptionType(value: string): value is RegularOptionType {
  return isRoleOptionType(value) === false;
}
