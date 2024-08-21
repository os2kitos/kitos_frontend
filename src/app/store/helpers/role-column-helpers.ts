import { APIBusinessRoleDTO } from "src/app/api/v1";
import { GridColumn } from "src/app/shared/models/grid-column.model";
import { RegistrationEntityTypes } from "src/app/shared/models/registrations/registration-entity-categories.model";
import { ROLES_SECTION_NAME } from "src/app/shared/persistent-state-constants";

export function roleDtoToRoleGridColumn(role: APIBusinessRoleDTO, entityType: RegistrationEntityTypes): GridColumn{
  return {
    field: `Roles.Role${role.id}`,
    title: `${role.name}`,
    section: ROLES_SECTION_NAME,
    style: 'page-link',
    hidden: false,
    entityType: entityType,
    idField: 'id',
    extraData: 'roles',
    width: 300,
  };
}
