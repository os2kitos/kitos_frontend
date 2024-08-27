import { APIBusinessRoleDTO } from "src/app/api/v1";
import { GridColumn } from "src/app/shared/models/grid-column.model";
import { RegistrationEntityTypes } from "src/app/shared/models/registrations/registration-entity-categories.model";

export function roleDtoToRoleGridColumn(role: APIBusinessRoleDTO, sectionName: string, entityType: RegistrationEntityTypes): GridColumn{
  return {
    field: `Roles.Role${role.id}`,
    title: `${role.name}`,
    section: sectionName,
    style: 'page-link',
    hidden: false,
    entityType: entityType,
    idField: 'id',
    extraData: 'roles',
    width: 300,
  };
}
