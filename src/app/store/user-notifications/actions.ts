import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIOwnerResourceType } from 'src/app/api/v2';
import { UserNotification } from './state';

export const UserNotificationActions = createActionGroup({
  source: 'UserNotification',
  events: {
    'Get notifications': (ownerResourceType: APIOwnerResourceType) => ({
      ownerResourceType,
    }),
    'Get notifications success': (ownerResourceType: APIOwnerResourceType, notifications: UserNotification[]) => ({
      ownerResourceType,
      notifications,
    }),
    'Get notifications error': emptyProps(),

    'Notification created': (ownerResourceType: APIOwnerResourceType) => ({
      ownerResourceType,
    }),
  },
});
