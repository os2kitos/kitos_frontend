import { APINotificationResponseDTO } from "src/app/api/v2";


export interface NotificationType {
  name: string,
  value: APINotificationResponseDTO.NotificationTypeEnum
}

export const notificationTypeOptions: NotificationType[] = [
  { name: $localize`Straks`, value: APINotificationResponseDTO.NotificationTypeEnum.Immediate },
  { name: $localize`Gentagelse`, value: APINotificationResponseDTO.NotificationTypeEnum.Repeat },
]
