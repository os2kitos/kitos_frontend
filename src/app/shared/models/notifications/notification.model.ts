import { uniqueId } from 'lodash';
import { DEFAULT_NOTIFICATION_DURATION } from '../../constants';
import { NotificationType } from '../../enums/notification-type';
import { NotificationData } from './notification-data.model';

export interface Notification {
  id: string;
  createdTimeStamp: number;
  data: NotificationData;
}

export function createNotification(
  message: string,
  type: NotificationType = NotificationType.default,
  durationInMs: number = DEFAULT_NOTIFICATION_DURATION
): Notification {
  return {
    createdTimeStamp: Date.now(),
    id: uniqueId(type),
    data: {
      message,
      type,
      durationInMs,
    },
  };
}
