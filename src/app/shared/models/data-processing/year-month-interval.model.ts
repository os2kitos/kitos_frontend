import { APIDataProcessingRegistrationReadModel } from "src/app/api/v1";

export interface YearMonthInterval {
  name: string;
  value: APIDataProcessingRegistrationReadModel.OversightIntervalEnum;
}

export enum YearMonthIntervalEnum {
  HalfYearly = 'Half_yearly',
  Yearly = 'Yearly',
  EverySecondYear = 'Every_second_year',
  Other = 'Other',
  Undecided = 'Undecided',
}

export const yearMonthIntervalOptions: YearMonthInterval[] = [
  { name: $localize`Halvårligt`, value: YearMonthIntervalEnum.HalfYearly },
  { name: $localize`Årligt`, value: YearMonthIntervalEnum.Yearly },
  { name: $localize`Hver andet år`, value: YearMonthIntervalEnum.EverySecondYear },
  { name: $localize`Andet`, value: YearMonthIntervalEnum.Other },
];

export const mapToYearMonthInterval = (
  value?: APIDataProcessingRegistrationReadModel.OversightIntervalEnum
): YearMonthInterval | undefined => {
  return yearMonthIntervalOptions.find((option) => option.value === value);
};

