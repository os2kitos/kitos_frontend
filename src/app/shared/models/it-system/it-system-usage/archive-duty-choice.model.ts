import { APIArchivingRegistrationsResponseDTO } from 'src/app/api/v2';

export interface ArchiveDutyChoice {
  name: string;
  value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum;
}

export const archiveDutyChoiceOptions: ArchiveDutyChoice[] = [
  {
    name: $localize`Under indfasning`,
    value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum.B,
  },
  {
    name: $localize`I drift`,
    value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum.K,
  },
  {
    name: $localize`Ved ikke`,
    value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum.Unknown,
  },
  {
    name: ``,
    value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum.Undecided,
  },
];

export const mapArchiveDutyChoice = (
  value?: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum
): ArchiveDutyChoice | undefined => {
  return archiveDutyChoiceOptions.find((option) => option.value === value);
};
