import { APIArchivingRegistrationsResponseDTO } from 'src/app/api/v2';

export interface ArchiveDutyChoice {
  name: string;
  value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum;
}

export const archiveDutyChoiceOptions: ArchiveDutyChoice[] = [
  {
    name: ``,
    value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum.Undecided,
  },
  {
    name: $localize`B`,
    value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum.B,
  },
  {
    name: $localize`K`,
    value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum.K,
  },
  {
    name: $localize`Ved ikke`,
    value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum.Unknown,
  },
];

export const mapArchiveDutyChoice = (
  value?: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum
): ArchiveDutyChoice | undefined => {
  return archiveDutyChoiceOptions.find((option) => option.value === value);
};
