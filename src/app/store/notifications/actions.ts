import { createActionGroup } from '@ngrx/store';
import { Notification } from 'src/app/shared/models/notifications/notification.model';

export const NotificationsActions = createActionGroup({
  source: 'Notifications',
  events: {
    'Add ': (notification: Notification) => ({ notification }),
    'Remove ': (notificationId: string) => ({ notificationId }),
  },
});
