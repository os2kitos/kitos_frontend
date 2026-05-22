import { APIOversightIntervalChoice } from 'src/app/api/v2';

export interface OversightInterval {
  name: string;
  value: APIOversightIntervalChoice;
}

export enum OversightIntervalEnum {
  BiYearly = 'BiYearly',
  Yearly = 'Yearly',
  EveryOtherYear = 'EveryOtherYear',
  EveryThirdYear = 'EveryThirdYear',
  Other = 'Other',
  Undecided = 'Undecided',
}

export const oversightIntervalOptions: OversightInterval[] = [
  { name: $localize`Halvårligt`, value: OversightIntervalEnum.BiYearly },
  { name: $localize`Årligt`, value: OversightIntervalEnum.Yearly },
  { name: $localize`Hver andet år`, value: OversightIntervalEnum.EveryOtherYear },
  { name: $localize`Hvert tredje år`, value: OversightIntervalEnum.EveryThirdYear },
  { name: $localize`Andet`, value: OversightIntervalEnum.Other },
];

export const mapToOversightInterval = (value?: APIOversightIntervalChoice): OversightInterval | undefined => {
  return oversightIntervalOptions.find((option) => option.value === value);
};
