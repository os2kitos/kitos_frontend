import { APINotificationResponseDTO } from "src/app/api/v2/model/notificationResponseDTO";

export type NotificationEntityType =
  'ItContract' |
  'ItSystemUsage' |
  'DataProcessingRegistration';

export const NotificationEntityTypeEnum = {
  ItContract: 'ItContract' as NotificationEntityType,
  ItSystemUsage: 'ItSystemUsage' as NotificationEntityType,
  DataProcessingRegistration: 'DataProcessingRegistration' as NotificationEntityType
}

export const mapNotificationEntityTypes = (entityType: APINotificationResponseDTO.OwnerResourceTypeEnum | undefined): NotificationEntityType | undefined => {
  switch (entityType) {
    case APINotificationResponseDTO.OwnerResourceTypeEnum.ItContract:
      return NotificationEntityTypeEnum.ItContract;
    case APINotificationResponseDTO.OwnerResourceTypeEnum.ItSystemUsage:
      return NotificationEntityTypeEnum.ItSystemUsage;
    case APINotificationResponseDTO.OwnerResourceTypeEnum.DataProcessingRegistration:
      return NotificationEntityTypeEnum.DataProcessingRegistration;
  }
  return undefined;
}
