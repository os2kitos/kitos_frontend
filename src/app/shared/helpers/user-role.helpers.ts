import { APIMutateRightRequestDTO } from "src/app/api/v2";
import { OrganizationUser, Right } from "../models/organization/organization-user/organization-user.model";
import { RegistrationEntityTypes } from "../models/registrations/registration-entity-categories.model";

export function getRights(user: OrganizationUser, entityType: RegistrationEntityTypes): Right[] {
  switch (entityType) {
    case 'organization-unit':
      return user.OrganizationUnitRights;
    case 'it-system':
      return user.ItSystemRights;
    case 'it-contract':
      return user.ItContractRights;
    case 'data-processing-registration':
      return user.DataProcessingRegistrationRights;
    default:
      throw new Error(`This component does not support entity type: ${entityType}`);
  }
}

export function getRoleTypeNameByEntityType(entityType: RegistrationEntityTypes): string {
  switch (entityType) {
    case 'organization-unit':
      return $localize`Organisationsenhed`;
    case 'it-system':
      return $localize`It System`;
    case 'it-contract':
      return $localize`It Kontrakt`;
    case 'data-processing-registration':
      return $localize`Databehandling`;
    default:
      throw new Error(`This component does not support entity type: ${entityType}`);
  }
}

export function getTypeTitleNameByType(entityType: RegistrationEntityTypes): string {
  switch (entityType) {
    case 'organization-unit':
      return $localize`Organisationsenhedroller`;
    case 'it-system':
      return $localize`Systemroller`;
    case 'it-contract':
      return $localize`Kontraktroller`;
    case 'data-processing-registration':
      return $localize`Databehandlingsroller`;
    default:
      throw new Error(`This component does not support entity type: ${entityType}`);
  }
}

export function userHasAnyRights(user: OrganizationUser): boolean {
  return user.OrganizationUnitRights.length > 0 ||
    user.ItSystemRights.length > 0 ||
    user.ItContractRights.length > 0 ||
    user.DataProcessingRegistrationRights.length > 0;
}

export function roleToCopyRoleRequestDTO(user: OrganizationUser, role: Right): APIMutateRightRequestDTO {
  return { userUuid: user.Uuid, roleId: role.role.id, entityUuid: role.entity.uuid };
}
