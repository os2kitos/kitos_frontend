import { APIBusinessRoleDTO } from 'src/app/api/v1';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

export function roleDtoToRoleGridColumns(
  role: APIBusinessRoleDTO,
  sectionName: string,
  entityType: RegistrationEntityTypes
): GridColumn[] {
  return [
    {
      field: `Roles.Role${role.id}`,
      title: `${role.name}`,
      section: sectionName,
      style: 'page-link',
      hidden: false,
      sortable: false,
      entityType: entityType,
      idField: 'id',
      extraData: 'roles',
      width: 300,
      persistId: `${rolePrefix(entityType)}${role.id}`,
    },
    {
      field: `Roles.Role${role.id}.email`,
      title: `${role.name} Email#`,
      section: sectionName,
      style: 'excel-only',
      hidden: true,
      entityType: entityType,
      idField: 'id',
      width: 300,
    },
  ];
}

function rolePrefix(entitypeType: RegistrationEntityTypes): string {
  switch (entitypeType) {
    case 'it-system-usage':
      return 'systemUsagerole';
    case 'it-contract':
      return 'itContract';
    case 'data-processing-registration':
      return 'dparole';
    default:
      throw new Error(`Unknown entity type: ${entitypeType}`);
  }
}
