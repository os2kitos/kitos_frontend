import { NotificationData } from './notification-data.model';

export interface Notification {
  id: string;
  createdTimeStamp: number;
  data: NotificationData;
}
