import { APIConnectionUpdateOrganizationUnitConsequenceDTO } from 'src/app/api/v2';
import { mapFkOrgConnectionChangeType } from './connection-change-type.model';

export interface FkOrganizationUnit {
  id: string;
  uuid: string;
  name: string;
  category: string;
  description: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptFkOrganizationUnit = (
  value: APIConnectionUpdateOrganizationUnitConsequenceDTO
): FkOrganizationUnit => {
  return {
    id: value.uuid!,
    uuid: value.uuid!,
    name: value.name ?? '',
    category: mapFkOrgConnectionChangeType(value.category)?.name ?? '',
    description: value.description ?? '',
  };
};
