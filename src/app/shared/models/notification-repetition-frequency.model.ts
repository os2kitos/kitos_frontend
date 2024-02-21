import { APINotificationResponseDTO } from "src/app/api/v2";


export interface NotificationRepetitionFrequency {
  name: string,
  value: APINotificationResponseDTO.RepetitionFrequencyEnum
}

export const notificationRepetitionFrequencyOptions: NotificationRepetitionFrequency[] = [
  { name: $localize`Time`, value: APINotificationResponseDTO.RepetitionFrequencyEnum.Hour },
  { name: $localize`Dag`, value: APINotificationResponseDTO.RepetitionFrequencyEnum.Day },
  { name: $localize`Uge`, value: APINotificationResponseDTO.RepetitionFrequencyEnum.Week },
  { name: $localize`Måned`, value: APINotificationResponseDTO.RepetitionFrequencyEnum.Month },
  { name: $localize`Kvartal`, value: APINotificationResponseDTO.RepetitionFrequencyEnum.Quarter },
  { name: $localize`Halvårlig`, value: APINotificationResponseDTO.RepetitionFrequencyEnum.HalfYear },
  { name: $localize`År`, value: APINotificationResponseDTO.RepetitionFrequencyEnum.Year },
]

export const mapNotificationRepetitionFrequency = (value?: APINotificationResponseDTO.RepetitionFrequencyEnum): NotificationRepetitionFrequency | undefined => {
  return notificationRepetitionFrequencyOptions.find((option) => option.value === value);
};
