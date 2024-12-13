import { APINotificationResponseDTO } from 'src/app/api/v2';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { RelatedEntityType } from 'src/app/store/alerts/state';

export function mapEntityTypeToOwnerResourceType(
  entityType: RegistrationEntityTypes
): APINotificationResponseDTO.OwnerResourceTypeEnum {
  switch (entityType) {
    case 'it-system-usage':
      return APINotificationResponseDTO.OwnerResourceTypeEnum.ItSystemUsage;
    case 'it-contract':
      return APINotificationResponseDTO.OwnerResourceTypeEnum.ItContract;
    case 'data-processing-registration':
      return APINotificationResponseDTO.OwnerResourceTypeEnum.DataProcessingRegistration;
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
  entityType: RelatedEntityType
): 'itContract' | 'itSystemUsage' | 'dataProcessingRegistration' {
  switch (entityType) {
    case RelatedEntityType.ItSystemUsage:
      return 'itSystemUsage';
    case RelatedEntityType.ItContract:
      return 'itContract';
    case RelatedEntityType.DataProcessingRegistration:
      return 'dataProcessingRegistration';
    default:
      throw new Error(`Related entity type for entity type: ${entityType} does not exist`);
  }
}
