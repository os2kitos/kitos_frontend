import { createActionGroup } from '@ngrx/store';
import { uniqueId } from 'lodash';
import { NotificationData } from 'src/app/shared/models/notifications/notification-data.model';
import { Notification } from 'src/app/shared/models/notifications/notification.model';

export const NotificationsActions = createActionGroup({
  source: 'Notifications',
  events: {
    'Add ': (data: NotificationData) => {
      return {
        newNotification: <Notification>{ data: data, id: uniqueId(`${data.type}`), createdTimeStamp: Date.now() },
      };
    },
    'Remove ': (notificationId: string) => ({ notificationId }),
  },
});
