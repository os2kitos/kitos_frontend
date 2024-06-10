import { APIDataProcessingRegistrationOversightResponseDTO } from 'src/app/api/v2';

export interface OversightIntervalOptions {
  name: string;
  value: APIDataProcessingRegistrationOversightResponseDTO.OversightIntervalEnum;
}

export enum OversightIntervalEnum {
  BiYearly = 'BiYearly',
  Yearly = 'Yearly',
  EveryOtherYear = 'EveryOtherYear',
  Other = 'Other',
  Undecided = 'Undecided',
}

export const oversightIntervalOptions: OversightIntervalOptions[] = [
  { name: $localize`Halvårligt`, value: OversightIntervalEnum.BiYearly },
  { name: $localize`Årligt`, value: OversightIntervalEnum.Yearly },
  { name: $localize`Hver andet år`, value: OversightIntervalEnum.EveryOtherYear },
  { name: $localize`Andet`, value: OversightIntervalEnum.Other },
];

export const mapToOversightIntervalEnum = (
  value?: APIDataProcessingRegistrationOversightResponseDTO.OversightIntervalEnum
): OversightIntervalOptions | undefined => {
  return oversightIntervalOptions.find((option) => option.value === value);
};
