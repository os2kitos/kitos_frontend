import { APIOversightIntervalChoice } from 'src/app/api/v2';

export interface YearMonthInterval {
  name: string;
  value: APIOversightIntervalChoice | string;
}

export enum YearMonthIntervalEnum {
  HalfYearly = 'Half_yearly',
  Yearly = 'Yearly',
  EverySecondYear = 'Every_second_year',
  EveryThirdYear = 'Every_third_year',
  Other = 'Other',
  Undecided = 'Undecided',
}

export const yearMonthIntervalOptions: YearMonthInterval[] = [
  { name: $localize`Halvårligt`, value: YearMonthIntervalEnum.HalfYearly },
  { name: $localize`Årligt`, value: YearMonthIntervalEnum.Yearly },
  { name: $localize`Hver andet år`, value: YearMonthIntervalEnum.EverySecondYear },
  { name: $localize`Hvert tredje år`, value: YearMonthIntervalEnum.EveryThirdYear },
  { name: $localize`Andet`, value: YearMonthIntervalEnum.Other },
];

export const mapToYearMonthInterval = (value?: APIOversightIntervalChoice): YearMonthInterval | undefined => {
  return yearMonthIntervalOptions.find((option) => option.value === value);
};
