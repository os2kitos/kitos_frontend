import { OrganizationUser, Right } from "../models/organization-user/organization-user.model";
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
