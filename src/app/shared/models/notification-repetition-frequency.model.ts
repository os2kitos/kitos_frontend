import { APIRepetitionFrequencyOptions } from 'src/app/api/v2';

export interface NotificationRepetitionFrequency {
  name: string;
  value: APIRepetitionFrequencyOptions;
}

export const notificationRepetitionFrequencyOptions: NotificationRepetitionFrequency[] = [
  { name: $localize`Time`, value: APIRepetitionFrequencyOptions.Hour },
  { name: $localize`Dag`, value: APIRepetitionFrequencyOptions.Day },
  { name: $localize`Uge`, value: APIRepetitionFrequencyOptions.Week },
  { name: $localize`Måned`, value: APIRepetitionFrequencyOptions.Month },
  { name: $localize`Kvartal`, value: APIRepetitionFrequencyOptions.Quarter },
  { name: $localize`Halvårlig`, value: APIRepetitionFrequencyOptions.HalfYear },
  { name: $localize`År`, value: APIRepetitionFrequencyOptions.Year },
];

export const mapNotificationRepetitionFrequency = (
  value?: APIRepetitionFrequencyOptions,
): NotificationRepetitionFrequency | undefined => {
  return notificationRepetitionFrequencyOptions.find((option) => option.value === value);
};
