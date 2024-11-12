export type RoleOptionTypes = 'it-system-usage' | 'it-contract' | 'data-processing' | 'organization-unit';

export function isRoleOptionType(value: string): value is RoleOptionTypes {
  return ['it-system-usage', 'it-contract', 'data-processing', 'organization-unit'].includes(value);
}
