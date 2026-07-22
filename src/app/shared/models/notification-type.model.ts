import { APINotificationSendType } from 'src/app/api/v2';

export interface NotificationType {
  name: string;
  value: APINotificationSendType;
}

export const notificationTypeOptions: NotificationType[] = [
  { name: $localize`Straks`, value: APINotificationSendType.Immediate },
  { name: $localize`Gentagelse`, value: APINotificationSendType.Repeat },
];

export const mapNotificationType = (value?: APINotificationSendType): NotificationType | undefined => {
  return notificationTypeOptions.find((option) => option.value === value);
};
