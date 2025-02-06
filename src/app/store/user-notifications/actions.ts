import { createActionGroup, emptyProps } from '@ngrx/store';
import { UserNotification } from './state';
import { APINotificationResponseDTO } from 'src/app/api/v2';

export const UserNotificationActions = createActionGroup({
  source: 'UserNotification',
  events: {
    'Get notifications': (ownerResourceType: APINotificationResponseDTO.OwnerResourceTypeEnum) => ({
      ownerResourceType,
    }),
    'Get notifications success': (
      ownerResourceType: APINotificationResponseDTO.OwnerResourceTypeEnum,
      notifications: UserNotification[]
    ) => ({ ownerResourceType, notifications }),
    'Get notifications error': emptyProps(),

    'Notification created': (ownerResourceType: APINotificationResponseDTO.OwnerResourceTypeEnum) => ({
      ownerResourceType,
    }),
  },
});
