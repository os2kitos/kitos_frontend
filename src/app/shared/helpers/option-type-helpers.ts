import { OptionTypeTableOption } from "../components/option-type-table/option-type-table.component";

export function isRoleOptionType(type: OptionTypeTableOption): boolean {
  return type === 'data-processing' || type === 'it-system-usage' || type == 'organization-unit' || type === 'it-contract';
}
