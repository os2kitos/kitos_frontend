import { APIOwnerResourceType } from 'src/app/api/v2';
import { RelatedEntityType } from 'src/app/store/alerts/state';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';

export function mapEntityTypeToOwnerResourceType(entityType: RegistrationEntityTypes): APIOwnerResourceType {
  switch (entityType) {
    case 'it-system-usage':
      return APIOwnerResourceType.ItSystemUsage;
    case 'it-contract':
      return APIOwnerResourceType.ItContract;
    case 'data-processing-registration':
      return APIOwnerResourceType.DataProcessingRegistration;
    default:
      throw new Error(`Owner resource type for entity type: ${entityType} does not exist`);
  }
}

export function mapEntityTypeToRelatedEntityType(entityType: RegistrationEntityTypes): RelatedEntityType {
  switch (entityType) {
    case 'it-system-usage':
      return RelatedEntityType.ItSystemUsage;
    case 'it-contract':
      return RelatedEntityType.ItContract;
    case 'data-processing-registration':
      return RelatedEntityType.DataProcessingRegistration;
    default:
      throw new Error(`Related entity type for entity type: ${entityType} does not exist`);
  }
}

export function mapRelatedEntityTypeToDTO(
  entityType: RelatedEntityType,
): 'ItContract' | 'ItSystemUsage' | 'DataProcessingRegistration' {
  switch (entityType) {
    case RelatedEntityType.ItSystemUsage:
      return 'ItSystemUsage';
    case RelatedEntityType.ItContract:
      return 'ItContract';
    case RelatedEntityType.DataProcessingRegistration:
      return 'DataProcessingRegistration';
    default:
      throw new Error(`Related entity type for entity type: ${entityType} does not exist`);
  }
}
