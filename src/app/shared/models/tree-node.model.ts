import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';

export interface TreeNodeModel {
  id: string;
  name: string;
  disabled: boolean;
  parentId: string;
  description?: string;
}

export const createNode = (unit: APIOrganizationUnitResponseDTO, disabledUnitsUuids?: string[]): TreeNodeModel => {
  return {
    id: unit.uuid,
    name: unit.name,
    disabled: disabledUnitsUuids?.includes(unit.uuid),
    parentId: unit.parentOrganizationUnit?.uuid,
    description: unit.ean ? `EAN: ${unit.ean}` : undefined,
  } as TreeNodeModel;
};
