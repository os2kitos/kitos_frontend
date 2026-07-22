import { APIOwnerResourceType } from 'src/app/api/v2';

export type NotificationEntityType = 'ItContract' | 'ItSystemUsage' | 'DataProcessingRegistration';

export const NotificationEntityTypeEnum = {
  ItContract: 'ItContract' as NotificationEntityType,
  ItSystemUsage: 'ItSystemUsage' as NotificationEntityType,
  DataProcessingRegistration: 'DataProcessingRegistration' as NotificationEntityType,
};

export const mapNotificationEntityTypes = (
  entityType: APIOwnerResourceType | undefined,
): NotificationEntityType | undefined => {
  switch (entityType) {
    case APIOwnerResourceType.ItContract:
      return NotificationEntityTypeEnum.ItContract;
    case APIOwnerResourceType.ItSystemUsage:
      return NotificationEntityTypeEnum.ItSystemUsage;
    case APIOwnerResourceType.DataProcessingRegistration:
      return NotificationEntityTypeEnum.DataProcessingRegistration;
  }
  return undefined;
};
